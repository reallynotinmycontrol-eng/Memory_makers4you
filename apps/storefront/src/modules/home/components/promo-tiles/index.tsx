import type { Banner } from "@lib/data/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FALLBACK_BG = ["bg-kumkum-600", "bg-peacock-700", "bg-zari-600"]

/** Promotional tiles (Admin → Storefront → Banners, placement "Promo tile"). */
export default function PromoTiles({ banners }: { banners: Banner[] }) {
  if (!banners.length) return null

  return (
    <section className="content-container py-6">
      <ul className={`grid gap-4 ${banners.length > 1 ? "small:grid-cols-2" : ""}`}>
        {banners.slice(0, 4).map((b, i) => {
          const inner = (
            <div
              className={`relative flex min-h-[180px] items-end overflow-hidden rounded-xl p-6 small:min-h-[220px] ${
                b.image_url ? "bg-ink" : FALLBACK_BG[i % FALLBACK_BG.length]
              }`}
            >
              {b.image_url && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.image_url}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
                </>
              )}
              <div className="relative">
                <p className="heading-display text-2xl text-white small:text-3xl">{b.title}</p>
                {b.subtitle && <p className="mt-1 text-sm text-white/85">{b.subtitle}</p>}
                {b.link && (
                  <span className="mt-3 inline-block text-sm font-bold text-zari-300 underline underline-offset-4">
                    {b.button_text || "Shop now"}
                  </span>
                )}
              </div>
            </div>
          )

          return (
            <li key={b.id}>
              {b.link ? (
                <LocalizedClientLink href={b.link} className="group block">
                  {inner}
                </LocalizedClientLink>
              ) : (
                inner
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
