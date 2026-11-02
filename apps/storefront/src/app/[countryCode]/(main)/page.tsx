import { Metadata } from "next"

import { getCategoryTiles, getSectionProducts } from "@lib/data/catalog"
import { getStoreContent, HomeSection } from "@lib/data/content"
import CategoryGrid from "@modules/home/components/category-grid"
import Hero from "@modules/home/components/hero"
import ProductRow from "@modules/home/components/product-row"
import PromoTiles from "@modules/home/components/promo-tiles"
import { TruckIcon } from "@modules/store-ui/icons"

export const metadata: Metadata = {
  description:
    "Shop silk thread, kundan stones, beads, resin art and craft supplies online. Shipped across India.",
}

// Re-render the homepage at most once a minute so admin edits show up.
export const revalidate = 60

async function Section({ section, countryCode }: { section: HomeSection; countryCode: string }) {
  if (section.type === "category_grid") {
    const tiles = await getCategoryTiles(section.category_handle, section.max_items)
    return (
      <CategoryGrid
        title={section.title}
        subtitle={section.subtitle}
        tiles={tiles}
        viewAllHref={section.category_handle ? `/categories/${section.category_handle}` : undefined}
      />
    )
  }

  const products = await getSectionProducts({
    countryCode,
    categoryHandle: section.category_handle,
    collectionHandle: section.collection_handle,
    max: section.max_items,
  })

  const viewAllHref = section.collection_handle
    ? `/collections/${section.collection_handle}`
    : section.category_handle
    ? `/categories/${section.category_handle}`
    : "/store"

  return (
    <ProductRow
      title={section.title}
      subtitle={section.subtitle}
      products={products}
      viewAllHref={viewAllHref}
    />
  )
}

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const { banners, sections, settings } = await getStoreContent()

  const hero = banners.filter((b) => b.placement === "hero")
  const promos = banners.filter((b) => b.placement === "promo")

  // With no sections configured yet, show all categories so the page isn't empty.
  const list: HomeSection[] = sections.length
    ? sections
    : [
        { id: "default-cats", title: "Shop by Category", type: "category_grid", max_items: 12, rank: 0 },
        { id: "default-new", title: "Latest Products", type: "product_grid", max_items: 8, rank: 1 },
      ]

  // Promo tiles appear after the second section.
  const before = list.slice(0, 2)
  const after = list.slice(2)

  return (
    <>
      <Hero banners={hero} />

      {settings.shipping_note && (
        <div className="border-b border-grey-10 bg-blush">
          <p className="content-container flex items-center justify-center gap-2 py-3 text-center text-[13px] text-grey-60">
            <TruckIcon size={18} className="shrink-0 text-peacock-700" />
            {settings.shipping_note}
          </p>
        </div>
      )}

      {before.map((s) => (
        <Section key={s.id} section={s} countryCode={countryCode} />
      ))}
      <PromoTiles banners={promos} />
      {after.map((s) => (
        <Section key={s.id} section={s} countryCode={countryCode} />
      ))}
    </>
  )
}
