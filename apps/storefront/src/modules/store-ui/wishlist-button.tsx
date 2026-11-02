"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import { clx } from "@medusajs/ui"
import { HeartIcon } from "./icons"

export default function WishlistButton({
  productId,
  className,
  withLabel,
}: {
  productId: string
  className?: string
  withLabel?: boolean
}) {
  const { has, toggle } = useWishlist()
  const saved = has(productId)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={clx(
        "flex items-center justify-center gap-2 transition-colors",
        saved ? "text-kumkum-600" : "text-ink/70 hover:text-kumkum-600",
        className
      )}
    >
      <HeartIcon filled={saved} size={20} />
      {withLabel && (
        <span className="text-sm font-semibold">
          {saved ? "Saved to wishlist" : "Add to wishlist"}
        </span>
      )}
    </button>
  )
}
