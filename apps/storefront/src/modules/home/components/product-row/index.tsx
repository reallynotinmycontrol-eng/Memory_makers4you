import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import SectionHeading from "../section-heading"

export default function ProductRow({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title: string
  subtitle?: string | null
  products: HttpTypes.StoreProduct[]
  viewAllHref?: string
}) {
  if (!products.length) return null

  return (
    <section className="content-container py-10 small:py-14">
      <SectionHeading title={title} subtitle={subtitle} viewAllHref={viewAllHref} />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 small:grid-cols-4 small:gap-x-6">
        {products.map((p) => (
          <li key={p.id}>
            <ProductPreview product={p} />
          </li>
        ))}
      </ul>
    </section>
  )
}
