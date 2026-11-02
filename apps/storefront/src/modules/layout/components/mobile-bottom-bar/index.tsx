"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BagIcon, GridIcon, HeartIcon, HomeIcon, UserIcon } from "@modules/store-ui/icons"
import { useParams, usePathname } from "next/navigation"

/** App-style navigation fixed to the bottom of the screen on phones. */
export default function MobileBottomBar({ cartCount }: { cartCount: number }) {
  const pathname = usePathname()
  const { countryCode } = useParams()
  const { ids } = useWishlist()

  const path = pathname.replace(`/${countryCode}`, "") || "/"

  const items = [
    { href: "/", label: "Home", icon: HomeIcon, active: path === "/" },
    { href: "/store", label: "Shop", icon: GridIcon, active: path.startsWith("/store") || path.startsWith("/categories") },
    { href: "/wishlist", label: "Wishlist", icon: HeartIcon, active: path.startsWith("/wishlist"), badge: ids.length },
    { href: "/cart", label: "Cart", icon: BagIcon, active: path.startsWith("/cart"), badge: cartCount },
    { href: "/account", label: "Account", icon: UserIcon, active: path.startsWith("/account") },
  ]

  return (
    <nav
      aria-label="Quick links"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-grey-10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur small:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon, active, badge }) => (
          <li key={href}>
            <LocalizedClientLink
              href={href}
              aria-current={active ? "page" : undefined}
              className={clx(
                "relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold",
                active ? "text-peacock-700" : "text-grey-50"
              )}
            >
              <Icon size={21} />
              {label}
              {!!badge && (
                <span className="absolute left-1/2 top-1 ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-kumkum-600 px-1 text-[10px] text-white">
                  {badge}
                </span>
              )}
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
