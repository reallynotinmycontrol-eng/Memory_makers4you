import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductRow from "@modules/home/components/product-row"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

/** Other products from the same category (falls back to the same collection). */
export default async function RelatedProducts({ product, countryCode }: RelatedProductsProps) {
  const categoryIds = (product.categories ?? []).map((c) => c.id)

  const queryParams: Record<string, any> = { limit: 9, is_giftcard: false }
  if (categoryIds.length) {
    queryParams.category_id = categoryIds
  } else if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }

  const products = await listProducts({ queryParams, countryCode })
    .then(({ response }) => response.products.filter((p) => p.id !== product.id).slice(0, 8))
    .catch(() => [])

  if (!products.length) {
    return null
  }

  return <ProductRow title="You may also like" products={products} />
}
