import React, { Suspense } from "react"

import { getStoreContent } from "@lib/data/content"
import { HttpTypes } from "@medusajs/types"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { TruckIcon } from "@modules/store-ui/icons"
import WishlistButton from "@modules/store-ui/wishlist-button"
import { notFound } from "next/navigation"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate = async ({
  product,
  region,
  countryCode,
  images,
}: ProductTemplateProps) => {
  if (!product || !product.id) {
    return notFound()
  }

  const { settings } = await getStoreContent()

  return (
    <>
      <div
        className="content-container grid gap-8 py-6 small:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] small:gap-14 small:py-10"
        data-testid="product-container"
      >
        <div className="small:sticky small:top-40 small:self-start">
          <ImageGallery images={images} title={product.title ?? undefined} />
        </div>

        <div className="flex flex-col gap-6">
          <ProductInfo product={product} />

          <Suspense
            fallback={<ProductActions disabled={true} product={product} region={region} />}
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>

          <WishlistButton productId={product.id} withLabel className="self-start" />

          {settings.shipping_note && (
            <p className="flex items-start gap-3 rounded-lg bg-blush p-4 text-sm text-grey-70">
              <TruckIcon size={20} className="shrink-0 text-peacock-700" />
              {settings.shipping_note}
            </p>
          )}

          <ProductTabs product={product} shippingNote={settings.shipping_note} />
        </div>
      </div>

      <div data-testid="related-products-container">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
