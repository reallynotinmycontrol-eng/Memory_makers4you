import { Metadata } from "next"

import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getStoreContent } from "@lib/data/content"
import { WishlistProvider } from "@lib/context/wishlist-context"
import { getBaseURL } from "@lib/util/env"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import MobileBottomBar from "@modules/layout/components/mobile-bottom-bar"
import WhatsappButton from "@modules/layout/components/whatsapp-button"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  const { settings } = await getStoreContent()
  const cartCount = cart?.items?.reduce((acc, i) => acc + i.quantity, 0) ?? 0

  return (
    <WishlistProvider>
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}
      {props.children}
      <Footer />
      <WhatsappButton number={settings.whatsapp} />
      <MobileBottomBar cartCount={cartCount} />
    </WishlistProvider>
  )
}
