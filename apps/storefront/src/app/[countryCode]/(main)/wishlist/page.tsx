import { Metadata } from "next"

import WishlistTemplate from "@modules/wishlist/templates"

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
}

export default function WishlistPage() {
  return <WishlistTemplate />
}
