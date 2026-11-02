"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
}

const OPTIONS: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
]

/** Compact "Sort by" dropdown shown above product grids. */
const RefinementList = ({ sortBy, "data-testid": dataTestId }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <label className="flex items-center gap-2 text-sm text-grey-60" data-testid={dataTestId}>
      Sort by
      <select
        value={sortBy}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams)
          params.set("sortBy", e.target.value)
          params.delete("page")
          router.push(`${pathname}?${params.toString()}`)
        }}
        className="h-10 rounded-full border border-grey-20 bg-white px-4 text-sm font-semibold text-ink focus:border-peacock-700 focus:outline-none"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default RefinementList
