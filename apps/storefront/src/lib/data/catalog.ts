import { HttpTypes } from "@medusajs/types"
import { getCategoryAndDescendantIds, listCategories } from "./categories"
import { getCollectionByHandle } from "./collections"
import { listProducts } from "./products"

export type CategoryTile = {
  id: string
  name: string
  handle: string
  image?: string | null
}

/**
 * Category tiles for the homepage and category pages. The tile image is
 * taken from the category's metadata `image_url` (set it in Admin →
 * Categories → Metadata), otherwise from one of its products.
 */
export const getCategoryTiles = async (
  parentHandle?: string | null,
  max = 12
): Promise<CategoryTile[]> => {
  const all = await listCategories({
    fields: "id,name,handle,rank,parent_category_id,metadata,*products",
    limit: 500,
  }).catch(() => [] as HttpTypes.StoreProductCategory[])

  const parent = parentHandle ? all.find((c) => c.handle === parentHandle) : null
  if (parentHandle && !parent) return []

  const picked = all
    .filter((c) => (parent ? c.parent_category_id === parent.id : !c.parent_category_id))
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .slice(0, max)

  const firstThumb = (cat: HttpTypes.StoreProductCategory): string | null => {
    const own = cat.products?.find((p) => p.thumbnail)?.thumbnail
    if (own) return own
    for (const child of all.filter((c) => c.parent_category_id === cat.id)) {
      const t = firstThumb(child)
      if (t) return t
    }
    return null
  }

  return picked.map((c) => ({
    id: c.id,
    name: c.name,
    handle: c.handle,
    image: ((c.metadata as Record<string, unknown> | null)?.image_url as string) || firstThumb(c),
  }))
}

/** Products for a homepage row, from a collection or a category tree. */
export const getSectionProducts = async ({
  countryCode,
  categoryHandle,
  collectionHandle,
  max = 8,
}: {
  countryCode: string
  categoryHandle?: string | null
  collectionHandle?: string | null
  max?: number
}) => {
  const queryParams: Record<string, any> = { limit: max, order: "-created_at" }

  if (collectionHandle) {
    const collection = await getCollectionByHandle(collectionHandle).catch(() => null)
    if (!collection) return []
    queryParams.collection_id = [collection.id]
  } else if (categoryHandle) {
    const ids = await getCategoryAndDescendantIds(categoryHandle)
    if (!ids.length) return []
    queryParams.category_id = ids
  }

  const {
    response: { products },
  } = await listProducts({ countryCode, queryParams })

  return products
}
