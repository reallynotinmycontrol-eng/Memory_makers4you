import { getStoreName } from "@lib/data/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronLeft } from "@modules/store-ui/icons"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const storeName = await getStoreName()

  return (
    <div className="relative w-full bg-white small:min-h-screen">
      <div className="h-16 border-b border-grey-10 bg-white">
        <nav className="content-container flex h-full items-center justify-between">
          <LocalizedClientLink
            href="/cart"
            className="flex flex-1 basis-0 items-center gap-x-1 text-sm font-semibold text-grey-60 hover:text-peacock-700"
            data-testid="back-to-cart-link"
          >
            <ChevronLeft size={18} />
            <span className="hidden small:block">Back to cart</span>
            <span className="block small:hidden">Back</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="heading-display text-xl"
            data-testid="store-link"
          >
            {storeName}
          </LocalizedClientLink>
          <p className="hidden flex-1 basis-0 text-right text-xs text-grey-50 small:block">
            Secure checkout
          </p>
          <div className="flex-1 basis-0 small:hidden" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}
