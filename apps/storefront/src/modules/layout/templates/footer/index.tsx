import { listCategoryTree } from "@lib/data/categories"
import { getStoreContent } from "@lib/data/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "@modules/store-ui/icons"

export default async function Footer() {
  const [{ settings }, tree] = await Promise.all([
    getStoreContent(),
    listCategoryTree(),
  ])
  const storeName =
    settings.store_name || process.env.NEXT_PUBLIC_STORE_NAME || "MemoryMakers4U"

  const socials = [
    { href: settings.instagram_url, label: "Instagram", Icon: InstagramIcon },
    { href: settings.facebook_url, label: "Facebook", Icon: FacebookIcon },
    { href: settings.youtube_url, label: "YouTube", Icon: YoutubeIcon },
    {
      href: settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}` : "",
      label: "WhatsApp",
      Icon: WhatsappIcon,
    },
  ].filter((s) => !!s.href)

  return (
    <footer className="mt-16 bg-peacock-900 pb-20 text-peacock-100 small:pb-0">
      <div className="content-container grid gap-10 py-14 small:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <p className="heading-display text-2xl text-white">{storeName}</p>
          {settings.footer_about && (
            <p className="mt-3 max-w-xs text-sm leading-6 text-peacock-100/80">
              {settings.footer_about}
            </p>
          )}
          {socials.length > 0 && (
            <ul className="mt-5 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white hover:border-zari-300 hover:text-zari-300"
                  >
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="mb-4 font-display text-lg text-white">Shop</p>
          <ul className="space-y-2 text-sm">
            {tree.slice(0, 8).map((c) => (
              <li key={c.id}>
                <LocalizedClientLink href={`/categories/${c.handle}`} className="hover:text-white">
                  {c.name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 font-display text-lg text-white">Help</p>
          <ul className="space-y-2 text-sm">
            <li>
              <LocalizedClientLink href="/account" className="hover:text-white">
                My account
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink href="/account/orders" className="hover:text-white">
                Track my orders
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink href="/wishlist" className="hover:text-white">
                Wishlist
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink href="/cart" className="hover:text-white">
                Cart
              </LocalizedClientLink>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 font-display text-lg text-white">Get in touch</p>
          <ul className="space-y-3 text-sm">
            {settings.address && (
              <li className="flex gap-3">
                <PinIcon size={18} className="mt-0.5 shrink-0 text-zari-300" />
                <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            )}
            {settings.phone && (
              <li className="flex gap-3">
                <PhoneIcon size={18} className="shrink-0 text-zari-300" />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex gap-3">
                <MailIcon size={18} className="shrink-0 text-zari-300" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
            {!settings.address && !settings.phone && !settings.email && (
              <li className="text-peacock-100/70">
                Add your address, phone and email in Admin → Storefront → Settings.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="content-container py-5 text-xs text-peacock-100/70">
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
