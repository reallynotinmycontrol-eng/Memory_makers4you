import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice
  const hasManyPrices =
    new Set((product.variants ?? []).map((v: any) => v.calculated_price?.calculated_amount))
      .size > 1

  if (!selectedPrice) {
    return <div className="block h-9 w-32 animate-pulse rounded bg-grey-10" />
  }

  const onSale = selectedPrice.price_type === "sale"

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-3">
        <span className="text-[1.75rem] font-bold text-peacock-800">
          {!variant && hasManyPrices && (
            <span className="text-base font-normal text-grey-50">From </span>
          )}
          <span data-testid="product-price" data-value={selectedPrice.calculated_price_number}>
            {selectedPrice.calculated_price}
          </span>
        </span>
        {onSale && (
          <>
            <span
              className="text-base text-grey-40 line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
            <span className="rounded-full bg-kumkum-50 px-2.5 py-0.5 text-xs font-bold text-kumkum-700">
              {selectedPrice.percentage_diff}% off
            </span>
          </>
        )}
      </p>
      <p className="mt-0.5 text-xs text-grey-50">Inclusive of all taxes</p>
    </div>
  )
}
