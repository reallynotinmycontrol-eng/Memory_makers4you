"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HeartIcon } from "@modules/store-ui/icons"

export default function WishlistLink({ className }: { className?: string }) {
  const { ids } = useWishlist()
  return (
    <LocalizedClientLink
      href="/wishlist"
      aria-label={`Wishlist, ${ids.length} items`}
      className={
        className ??
        "relative flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-blush"
      }
    >
      <HeartIcon />
      {ids.length > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-kumkum-600 px-1 text-[11px] font-bold text-white">
          {ids.length}
        </span>
      )}
    </LocalizedClientLink>
  )
}
