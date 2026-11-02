import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WishlistButton from "@modules/store-ui/wishlist-button"
import Thumbnail from "../thumbnail"
import QuickAdd from "./quick-add"

const variantInStock = (v: HttpTypes.StoreProductVariant) =>
  !v.manage_inventory || v.allow_backorder || (v.inventory_quantity ?? 0) > 0

export default function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region?: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  const variants = product.variants ?? []
  const inStock = variants.some(variantInStock)
  const singleVariant = variants.length === 1 ? variants[0] : undefined
  const hasManyPrices =
    new Set(variants.map((v: any) => v.calculated_price?.calculated_amount)).size > 1
  const onSale = cheapestPrice?.price_type === "sale"

  return (
    <article className="group flex h-full flex-col" data-testid="product-wrapper">
      <div className="relative">
        <LocalizedClientLink href={`/products/${product.handle}`} tabIndex={-1} aria-hidden>
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            alt={product.title ?? "Product"}
          />
        </LocalizedClientLink>
        <WishlistButton
          productId={product.id!}
          className="absolute right-2 top-2 h-9 w-9 rounded-full bg-white/90 shadow-sm"
        />
        {onSale && (
          <span className="absolute left-2 top-2 rounded-full bg-kumkum-600 px-2.5 py-1 text-[11px] font-bold text-white">
            {cheapestPrice?.percentage_diff}% off
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-ink">
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="hover:text-peacock-700"
            data-testid="product-title"
          >
            {product.title}
          </LocalizedClientLink>
        </h3>

        <p className="mt-1.5 flex items-baseline gap-2" data-testid="price">
          {cheapestPrice ? (
            <>
              <span className="text-[15px] font-bold text-peacock-800">
                {hasManyPrices && <span className="font-normal text-grey-50">From </span>}
                {cheapestPrice.calculated_price}
              </span>
              {onSale && (
                <span className="text-xs text-grey-40 line-through">
                  {cheapestPrice.original_price}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-grey-50">Price on request</span>
          )}
        </p>

        <div className="mt-3">
          <QuickAdd
            handle={product.handle!}
            variantId={singleVariant && variantInStock(singleVariant) ? singleVariant.id : undefined}
            inStock={inStock}
          />
        </div>
      </div>
    </article>
  )
}
