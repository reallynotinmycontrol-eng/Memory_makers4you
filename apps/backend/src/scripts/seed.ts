import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import { STORE_CONTENT_MODULE } from "../modules/store-content"
import StoreContentModuleService from "../modules/store-content/service"
import { CATEGORY_TREE, PRODUCTS } from "./catalog"

const STORE_NAME = process.env.STORE_NAME || "MemoryMakers4U"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

export default async function seedCraftStore({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const storeModule = container.resolve(Modules.STORE)
  const regionModule = container.resolve(Modules.REGION)

  // Running the seed twice would create duplicates, so stop early.
  const existingRegions = await regionModule.listRegions({ currency_code: "inr" })
  if (existingRegions.length) {
    logger.info("India region already exists – the store looks seeded. Skipping.")
    return
  }

  // ------------------------------------------------------------ store
  logger.info("Setting up the store…")
  const [store] = await storeModule.listStores()

  let [salesChannel] = await salesChannelModule.listSalesChannels({
    name: "Default Sales Channel",
  })
  if (!salesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
    })
    salesChannel = result[0]
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: STORE_NAME,
        supported_currencies: [{ currency_code: "inr", is_default: true }],
        default_sales_channel_id: salesChannel.id,
      },
    },
  })

  // ----------------------------------------------------------- region
  logger.info("Creating the India region (INR)…")
  const razorpayEnabled =
    !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET

  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries: ["in"],
          // "Manual" payment is handy for testing locally. Remove it in
          // Admin → Settings → Regions once Razorpay is set up.
          payment_providers: razorpayEnabled
            ? ["pp_razorpay_razorpay", "pp_system_default"]
            : ["pp_system_default"],
        },
      ],
    },
  })
  const region = regions[0]

  // Prices are entered inclusive of GST, so no extra tax is added at checkout.
  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "in", provider_id: "tp_system" }],
  })

  // -------------------------------------------------- stock & shipping
  logger.info("Creating warehouse and shipping options…")
  const { result: locations } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "Main Warehouse",
          address: { city: "", country_code: "IN", address_1: "" },
        },
      ],
    },
  })
  const location = locations[0]

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_location_id: location.id },
    },
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  const profiles = await fulfillmentModule.listShippingProfiles({ type: "default" })
  let shippingProfile = profiles[0]
  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
    })
    shippingProfile = result[0]
  }

  const fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
    name: "India delivery",
    type: "shipping",
    service_zones: [
      { name: "India", geo_zones: [{ country_code: "in", type: "country" }] },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  })

  const shippingRules = [
    { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
    { attribute: "is_return", value: "false", operator: "eq" as const },
  ]

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Delivery",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Delivered in 4–7 working days.",
          code: "standard",
        },
        prices: [
          { currency_code: "inr", amount: 70 },
          { region_id: region.id, amount: 70 },
        ],
        rules: shippingRules,
      },
      {
        name: "Express Delivery",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Delivered in 2–3 working days.",
          code: "express",
        },
        prices: [
          { currency_code: "inr", amount: 150 },
          { region_id: region.id, amount: 150 },
        ],
        rules: shippingRules,
      },
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: location.id, add: [salesChannel.id] },
  })

  // ------------------------------------------------ publishable API key
  logger.info("Creating the storefront API key…")
  const { data: keys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token"],
    filters: { type: "publishable" },
  })
  let apiKey = keys[0] as { id: string; token: string } | undefined
  if (!apiKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{ title: "Storefront", type: "publishable", created_by: "" }],
      },
    })
    apiKey = result[0] as unknown as { id: string; token: string }
  }
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: apiKey.id, add: [salesChannel.id] },
  })

  // ------------------------------------------------------- categories
  logger.info("Creating categories…")
  const { result: parents } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: CATEGORY_TREE.map((c, i) => ({
        name: c.name,
        handle: slugify(c.name),
        description: c.description,
        is_active: true,
        rank: i,
      })),
    },
  })

  const children = CATEGORY_TREE.flatMap((c) => {
    const parent = parents.find((p) => p.name === c.name)!
    return c.children.map((name, i) => ({
      name,
      handle: slugify(name),
      parent_category_id: parent.id,
      is_active: true,
      rank: i,
    }))
  })
  const { result: childCategories } = await createProductCategoriesWorkflow(
    container
  ).run({ input: { product_categories: children } })

  const categoryId = (name: string) => {
    const found = childCategories.find((c) => c.name === name)
    if (!found) throw new Error(`Seed: unknown category "${name}"`)
    return found.id
  }

  // ------------------------------------------------------ collections
  const { result: collections } = await createCollectionsWorkflow(container).run({
    input: {
      collections: [
        { title: "New Arrivals", handle: "new-arrivals" },
        { title: "Best Sellers", handle: "best-sellers" },
      ],
    },
  })
  const newArrivals = collections.find((c) => c.handle === "new-arrivals")!
  const bestSellers = collections.find((c) => c.handle === "best-sellers")!

  // --------------------------------------------------------- products
  logger.info(`Creating ${PRODUCTS.length} products…`)
  const products = PRODUCTS.map((p, index) => {
    const handle = slugify(p.title)
    const skuBase = handle.toUpperCase().slice(0, 24)

    return {
      title: p.title,
      handle,
      description: p.description,
      status: ProductStatus.PUBLISHED,
      category_ids: p.categories.map(categoryId),
      collection_id:
        index % 3 === 0 ? bestSellers.id : index % 3 === 1 ? newArrivals.id : undefined,
      shipping_profile_id: shippingProfile.id,
      sales_channels: [{ id: salesChannel.id }],
      options: p.options,
      variants: p.variants.map((v) => {
        const values = Object.values(v.options)
        return {
          title: values.join(" / "),
          sku: [skuBase, ...values.map((x) => slugify(x).toUpperCase())].join("-"),
          options: v.options,
          prices: [{ amount: v.price, currency_code: "inr" }],
        }
      }),
    }
  })

  await createProductsWorkflow(container).run({ input: { products } })

  // -------------------------------------------------------- inventory
  logger.info("Adding stock…")
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })
  const levels: CreateInventoryLevelInput[] = inventoryItems.map((item) => ({
    location_id: location.id,
    stocked_quantity: 100,
    inventory_item_id: item.id,
  }))
  await createInventoryLevelsWorkflow(container).run({
    input: { inventory_levels: levels },
  })

  // ---------------------------------------------- storefront content
  logger.info("Adding homepage content…")
  const content: StoreContentModuleService = container.resolve(STORE_CONTENT_MODULE)

  await content.upsertSettings({
    store_name: STORE_NAME,
    // Served by the storefront from apps/storefront/public/logo.png
    logo_url: "/logo.png",
    announcement_text: "No Cash on Delivery · Shipping charges extra",
    announcement_link: "",
    shipping_note: "Ships in 1–2 working days. Shipping charges are calculated at checkout.",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    instagram_url: "",
    facebook_url: "",
    youtube_url: "",
    footer_about:
      "Quality jewellery-making and craft supplies for makers across India.",
  })

  // No banners: the homepage is a catalogue of category grids. Hero and
  // promo banners can be added later in Admin → Storefront if wanted.

  // Homepage: one photo grid per main category, in menu order.
  // Reorder, edit or add product rows in Admin → Storefront.
  await content.createHomeSections(
    CATEGORY_TREE.map((c, rank) => ({
      title: c.name,
      type: "category_grid",
      category_handle: slugify(c.name),
      max_items: 24,
      rank,
    })) as any
  )

  logger.info("✔ Seeding finished.")
  logger.info("--------------------------------------------------------------")
  logger.info("Copy this publishable key into apps/storefront/.env.local as")
  logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`)
  logger.info("--------------------------------------------------------------")
}
