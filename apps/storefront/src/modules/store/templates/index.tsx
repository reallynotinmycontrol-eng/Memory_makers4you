import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import ListingHeader from "@modules/store-ui/listing-header"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  query,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  /** When set, the page shows search results. */
  query?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="content-container py-8" data-testid="category-container">
      <ListingHeader
        title={query ? `Results for “${query}”` : "All products"}
        sortBy={sort}
      />
      <Suspense key={query} fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
          query={query}
        />
      </Suspense>
    </div>
  )
}

export default StoreTemplate
