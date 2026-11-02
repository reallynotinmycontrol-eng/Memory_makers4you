import { notFound } from "next/navigation"
import { Suspense } from "react"

import { getCategoryTiles } from "@lib/data/catalog"
import { getCategoryAndDescendantIds } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import ListingHeader from "@modules/store-ui/listing-header"
import PlaceholderArt from "@modules/store-ui/placeholder-art"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  if (!category || !countryCode) notFound()

  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const parents: HttpTypes.StoreProductCategory[] = []
  let p = category.parent_category
  while (p) {
    parents.unshift(p)
    p = p.parent_category
  }

  const [subTiles, categoryIds] = await Promise.all([
    getCategoryTiles(category.handle, 60),
    getCategoryAndDescendantIds(category.handle),
  ])

  return (
    <div className="content-container py-8" data-testid="category-container">
      <ListingHeader
        title={category.name}
        description={category.description}
        crumbs={parents.map((c) => ({ label: c.name, href: `/categories/${c.handle}` }))}
        sortBy={sort}
      />

      {subTiles.length > 0 && (
        <ul className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 small:mx-0 small:flex-wrap small:px-0">
          {subTiles.map((t) => (
            <li key={t.id} className="shrink-0">
              <LocalizedClientLink
                href={`/categories/${t.handle}`}
                className="flex items-center gap-2 rounded-full border border-grey-20 bg-white py-1.5 pl-1.5 pr-4 text-sm font-semibold text-ink hover:border-peacock-700 hover:text-peacock-700"
              >
                <span className="block h-8 w-8 overflow-hidden rounded-full bg-blush">
                  {t.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <PlaceholderArt name={t.name} className="h-full w-full" />
                  )}
                </span>
                {t.name}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      )}

      <Suspense fallback={<SkeletonProductGrid numberOfProducts={8} />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          categoryIds={categoryIds.length ? categoryIds : [category.id]}
          countryCode={countryCode}
        />
      </Suspense>
    </div>
  )
}
