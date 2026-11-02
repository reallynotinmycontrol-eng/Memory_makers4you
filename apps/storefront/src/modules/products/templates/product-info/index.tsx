import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRight } from "@modules/store-ui/icons"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

/** Breadcrumb from the product's first category, then the product title. */
const ProductInfo = ({ product }: ProductInfoProps) => {
  const category = product.categories?.[0]
  const trail: { name: string; handle: string }[] = []
  let c: HttpTypes.StoreProductCategory | null | undefined = category
  while (c) {
    trail.unshift({ name: c.name, handle: c.handle })
    c = c.parent_category
  }

  return (
    <div id="product-info">
      <nav aria-label="Breadcrumb" className="mb-3">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-grey-50">
          <li>
            <LocalizedClientLink href="/" className="hover:text-peacock-700">
              Home
            </LocalizedClientLink>
          </li>
          {trail.map((t) => (
            <li key={t.handle} className="flex items-center gap-1">
              <ChevronRight size={12} />
              <LocalizedClientLink href={`/categories/${t.handle}`} className="hover:text-peacock-700">
                {t.name}
              </LocalizedClientLink>
            </li>
          ))}
        </ol>
      </nav>
      <h1 className="heading-display text-[1.9rem] leading-tight small:text-[2.4rem]" data-testid="product-title">
        {product.title}
      </h1>
      {product.subtitle && <p className="mt-2 text-grey-60">{product.subtitle}</p>}
    </div>
  )
}

export default ProductInfo
