"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import QuickAdd from "@modules/products/components/product-preview/quick-add"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function WishlistTemplate() {
  const { ids, remove } = useWishlist()
  const { countryCode } = useParams()
  const [products, setProducts] = useState<HttpTypes.StoreProduct[] | null>(null)

  useEffect(() => {
    if (!ids.length) {
      setProducts([])
      return
    }
    let cancelled = false
    listProducts({
      countryCode: countryCode as string,
      queryParams: { id: ids, limit: 100 } as any,
    })
      .then(({ response }) => {
        if (cancelled) return
        // Keep the order the customer saved them in.
        const byId = new Map(response.products.map((p) => [p.id, p]))
        setProducts(ids.map((id) => byId.get(id)).filter(Boolean) as HttpTypes.StoreProduct[])
      })
      .catch(() => !cancelled && setProducts([]))
    return () => {
      cancelled = true
    }
  }, [ids, countryCode])

  return (
    <div className="content-container py-8">
      <h1 className="heading-display text-3xl small:text-4xl">Wishlist</h1>
      <p className="mt-1 text-sm text-grey-50">
        Saved on this device. Tap the heart on any product to add it here.
      </p>

      {products === null ? (
        <p className="mt-10 text-sm text-grey-50">Loading your saved items…</p>
      ) : products.length === 0 ? (
        <div className="mt-8 rounded-xl bg-blush px-6 py-16 text-center">
          <p className="heading-display text-xl">Your wishlist is empty</p>
          <p className="mt-2 text-sm text-grey-50">Save products you like and come back to them later.</p>
          <LocalizedClientLink href="/store" className="btn-primary mt-6">
            Browse products
          </LocalizedClientLink>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 small:grid-cols-4 small:gap-x-6">
          {products.map((p) => {
            const { cheapestPrice } = getProductPrice({ product: p })
            const variants = p.variants ?? []
            const inStock = variants.some(
              (v) => !v.manage_inventory || v.allow_backorder || (v.inventory_quantity ?? 0) > 0
            )
            return (
              <li key={p.id} className="flex flex-col">
                <LocalizedClientLink href={`/products/${p.handle}`} className="group">
                  <Thumbnail thumbnail={p.thumbnail} images={p.images} size="full" alt={p.title ?? ""} />
                  <p className="mt-3 line-clamp-2 text-sm font-semibold group-hover:text-peacock-700">
                    {p.title}
                  </p>
                </LocalizedClientLink>
                {cheapestPrice && (
                  <p className="mt-1 text-[15px] font-bold text-peacock-800">
                    {cheapestPrice.calculated_price}
                  </p>
                )}
                <div className="mt-3 flex flex-col gap-2">
                  <QuickAdd
                    handle={p.handle!}
                    variantId={variants.length === 1 ? variants[0].id : undefined}
                    inStock={inStock}
                  />
                  <button
                    onClick={() => remove(p.id!)}
                    className="text-xs font-semibold text-grey-50 underline underline-offset-2 hover:text-kumkum-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
