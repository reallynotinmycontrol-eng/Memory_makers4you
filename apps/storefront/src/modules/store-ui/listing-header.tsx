import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { ChevronRight } from "./icons"

/** Breadcrumb, title, description and sort control for product listings. */
export default function ListingHeader({
  title,
  description,
  crumbs = [],
  sortBy,
}: {
  title: string
  description?: string | null
  crumbs?: { label: string; href: string }[]
  sortBy: SortOptions
}) {
  return (
    <div className="mb-6">
      <nav aria-label="Breadcrumb" className="mb-3">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-grey-50">
          <li>
            <LocalizedClientLink href="/" className="hover:text-peacock-700">
              Home
            </LocalizedClientLink>
          </li>
          {crumbs.map((c) => (
            <li key={c.href} className="flex items-center gap-1">
              <ChevronRight size={12} />
              <LocalizedClientLink href={c.href} className="hover:text-peacock-700">
                {c.label}
              </LocalizedClientLink>
            </li>
          ))}
          <li className="flex items-center gap-1 text-grey-70">
            <ChevronRight size={12} />
            <span aria-current="page">{title}</span>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col gap-4 small:flex-row small:items-end small:justify-between">
        <div>
          <h1 className="heading-display text-3xl small:text-4xl" data-testid="category-page-title">
            {title}
          </h1>
          {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-grey-60">{description}</p>}
        </div>
        <RefinementList sortBy={sortBy} data-testid="sort-by-container" />
      </div>
    </div>
  )
}
