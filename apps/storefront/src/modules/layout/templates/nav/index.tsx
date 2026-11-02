import { Suspense } from "react"

import { listCategoryTree } from "@lib/data/categories"
import { getStoreContent } from "@lib/data/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnnouncementBar from "@modules/layout/components/announcement-bar"
import CartButton from "@modules/layout/components/cart-button"
import MegaMenu from "@modules/layout/components/mega-menu"
import { MobileMenuButton } from "@modules/layout/components/mobile-menu"
import SearchForm from "@modules/layout/components/search-form"
import WishlistLink from "@modules/layout/components/wishlist-link"
import { BagIcon, UserIcon } from "@modules/store-ui/icons"

export default async function Nav() {
  const [{ settings }, tree] = await Promise.all([
    getStoreContent(),
    listCategoryTree(),
  ])
  const storeName =
    settings.store_name || process.env.NEXT_PUBLIC_STORE_NAME || "My Craft Store"

  return (
    <>
      <AnnouncementBar
        text={settings.announcement_text}
        link={settings.announcement_link}
      />
      <div className="sticky top-0 inset-x-0 z-50 bg-white shadow-[0_1px_0_rgba(31,27,36,0.06)]">
        <header className="content-container flex h-16 items-center gap-3 small:h-20 small:gap-8">
          <MobileMenuButton tree={tree} storeName={storeName} />

          <LocalizedClientLink
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2 small:flex-none"
            data-testid="nav-store-link"
          >
            {settings.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logo_url} alt={storeName} className="h-10 w-auto small:h-12" />
            ) : (
              <>
                <span aria-hidden className="kundan-ring hidden h-3 w-3 shrink-0 rounded-full bg-kumkum-600 xsmall:block" />
                <span className="heading-display truncate text-xl small:text-2xl">{storeName}</span>
              </>
            )}
          </LocalizedClientLink>

          <div className="hidden flex-1 small:block">
            <Suspense>
              <SearchForm />
            </Suspense>
          </div>

          <div className="flex items-center gap-1">
            <LocalizedClientLink
              href="/account"
              aria-label="My account"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-blush small:flex"
              data-testid="nav-account-link"
            >
              <UserIcon />
            </LocalizedClientLink>
            <WishlistLink className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-blush small:flex" />
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  aria-label="Cart"
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                >
                  <BagIcon />
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </header>

        {/* Search on phones sits under the logo row */}
        <div className="content-container pb-3 small:hidden">
          <Suspense>
            <SearchForm id="site-search-mobile" />
          </Suspense>
        </div>

        <MegaMenu tree={tree} />
      </div>
    </>
  )
}
