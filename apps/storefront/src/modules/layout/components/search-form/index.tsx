"use client"

import { SearchIcon } from "@modules/store-ui/icons"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function SearchForm({
  id = "site-search",
  autoFocus,
  onSubmitted,
}: {
  id?: string
  autoFocus?: boolean
  onSubmitted?: () => void
}) {
  const router = useRouter()
  const { countryCode } = useParams()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get("q") ?? "")

  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault()
        const term = q.trim()
        if (!term) return
        router.push(`/${countryCode}/search?q=${encodeURIComponent(term)}`)
        onSubmitted?.()
      }}
    >
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        type="search"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search beads, kundan, resin…"
        className="h-11 w-full rounded-full border border-grey-20 bg-blush pl-5 pr-12 text-sm text-ink placeholder:text-grey-50 focus:border-peacock-700 focus:bg-white focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-peacock-700 text-white hover:bg-peacock-800"
      >
        <SearchIcon size={18} />
      </button>
    </form>
  )
}
