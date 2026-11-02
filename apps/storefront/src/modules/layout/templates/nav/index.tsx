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
    settings.store_name || process.env.NEXT_PUBLIC_STORE_NAME || "MemoryMakers4U"

  return (
    <>
      <AnnouncementBar
        text={settings.announcement_text}
        link={settings.announcement_link}
      />
      <div className="sticky top-0 inset-x-0 z-50 bg-white shadow-[0_1px_0_rgba(31,27,36,0.06)]">
        {/* Desktop: search | centred logo | icons. Phones: menu | logo | cart. */}
        <header className="content-container flex h-16 items-center gap-3 small:grid small:h-24 small:grid-cols-[1fr_auto_1fr] small:gap-8">
          <MobileMenuButton tree={tree} storeName={storeName} />

          <LocalizedClientLink
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2 small:order-2 small:flex-none small:justify-self-center"
            data-testid="nav-store-link"
          >
            {settings.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <>
                <img src={settings.logo_url} alt="" className="h-11 w-11 shrink-0 small:h-16 small:w-16" />
                <span className="heading-display truncate text-xl text-peacock-800 small:text-3xl">{storeName}</span>
              </>
            ) : (
              <>
                <span aria-hidden className="kundan-ring hidden h-3 w-3 shrink-0 rounded-full bg-kumkum-600 xsmall:block" />
                <span className="heading-display truncate text-xl small:text-2xl">{storeName}</span>
              </>
            )}
          </LocalizedClientLink>

          <div className="hidden w-full max-w-xs small:order-1 small:block">
            <Suspense>
              <SearchForm />
            </Suspense>
          </div>

          <div className="flex items-center gap-1 small:order-3 small:justify-self-end">
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
