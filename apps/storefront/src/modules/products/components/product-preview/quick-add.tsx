"use client"

import { addToCart } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

/**
 * "Add to cart" straight from the product card when there is only one
 * variant; otherwise links to the product page to choose options.
 */
export default function QuickAdd({
  handle,
  variantId,
  inStock,
}: {
  handle: string
  variantId?: string
  inStock: boolean
}) {
  const { countryCode } = useParams()
  const router = useRouter()
  const [state, setState] = useState<"idle" | "adding" | "added" | "error">("idle")

  const base =
    "flex h-9 w-full items-center justify-center rounded-full text-[13px] font-semibold transition-colors"

  if (!inStock) {
    return (
      <span className={`${base} cursor-not-allowed bg-grey-10 text-grey-50`}>Out of stock</span>
    )
  }

  if (!variantId) {
    return (
      <LocalizedClientLink
        href={`/products/${handle}`}
        className={`${base} border border-peacock-700 text-peacock-700 hover:bg-peacock-50`}
      >
        Choose options
      </LocalizedClientLink>
    )
  }

  return (
    <button
      type="button"
      disabled={state === "adding"}
      onClick={async () => {
        setState("adding")
        try {
          await addToCart({ variantId, quantity: 1, countryCode: countryCode as string })
          setState("added")
          router.refresh()
          setTimeout(() => setState("idle"), 1800)
        } catch {
          setState("error")
          setTimeout(() => setState("idle"), 2500)
        }
      }}
      className={`${base} bg-peacock-700 text-white hover:bg-peacock-800 disabled:opacity-60`}
    >
      {state === "adding"
        ? "Adding…"
        : state === "added"
        ? "Added to cart"
        : state === "error"
        ? "Couldn't add – try again"
        : "Add to cart"}
    </button>
  )
}
