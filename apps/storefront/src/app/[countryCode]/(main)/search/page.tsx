import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
}

type Params = {
  searchParams: Promise<{ q?: string; sortBy?: SortOptions; page?: string }>
  params: Promise<{ countryCode: string }>
}

export default async function SearchPage(props: Params) {
  const { countryCode } = await props.params
  const { q, sortBy, page } = await props.searchParams
  const query = (q ?? "").trim()

  if (!query) {
    return (
      <div className="content-container py-16 text-center">
        <h1 className="heading-display text-3xl">Search</h1>
        <p className="mt-2 text-sm text-grey-50">
          Type what you&apos;re looking for in the search box above, for example
          “kundan” or “clip stones”.
        </p>
      </div>
    )
  }

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      query={query}
    />
  )
}
