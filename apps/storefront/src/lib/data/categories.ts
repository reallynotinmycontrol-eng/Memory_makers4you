import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
    // Refresh catalogue data every minute so admin changes show up quickly
    revalidate: 60,
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
    // Refresh catalogue data every minute so admin changes show up quickly
    revalidate: 60,
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}

/**
 * Top-level categories with their sub-categories, in admin order.
 * Used by the mega-menu, mobile menu and footer.
 */
export const listCategoryTree = async () => {
  const all = await listCategories({
    fields: "id,name,handle,rank,parent_category_id,metadata,*category_children",
    limit: 500,
  }).catch(() => [] as HttpTypes.StoreProductCategory[])

  const byRank = (a: HttpTypes.StoreProductCategory, b: HttpTypes.StoreProductCategory) =>
    (a.rank ?? 0) - (b.rank ?? 0)

  return all
    .filter((c) => !c.parent_category_id)
    .sort(byRank)
    .map((c) => ({
      ...c,
      category_children: [...(c.category_children ?? [])].sort(byRank),
    }))
}

/** The ids of a category and all of its descendants. */
export const getCategoryAndDescendantIds = async (handle: string) => {
  const all = await listCategories({
    fields: "id,handle,parent_category_id",
    limit: 500,
  }).catch(() => [] as HttpTypes.StoreProductCategory[])

  const root = all.find((c) => c.handle === handle)
  if (!root) return []

  const ids = [root.id]
  for (let i = 0; i < ids.length; i++) {
    all
      .filter((c) => c.parent_category_id === ids[i])
      .forEach((c) => ids.push(c.id))
  }
  return ids
}
