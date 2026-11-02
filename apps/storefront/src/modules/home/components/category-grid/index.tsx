import type { CategoryTile } from "@lib/data/catalog"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PlaceholderArt from "@modules/store-ui/placeholder-art"
import SectionHeading from "../section-heading"

/**
 * Round category tiles set in a double gold ring, like a kundan stone in
 * its setting. Scrolls sideways on phones, wraps into a grid on desktop.
 */
export default function CategoryGrid({
  title,
  subtitle,
  tiles,
  viewAllHref,
}: {
  title?: string
  subtitle?: string | null
  tiles: CategoryTile[]
  viewAllHref?: string
}) {
  if (!tiles.length) return null

  return (
    <section className="content-container py-10 small:py-14">
      {title && <SectionHeading title={title} subtitle={subtitle} viewAllHref={viewAllHref} />}
      <ul className="no-scrollbar -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 pt-2 small:mx-0 small:grid small:grid-cols-6 small:gap-x-6 small:gap-y-10 small:overflow-visible small:px-0">
        {tiles.map((t) => (
          <li key={t.id} className="w-[104px] shrink-0 snap-start small:w-auto">
            <LocalizedClientLink
              href={`/categories/${t.handle}`}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <span className="kundan-ring relative block aspect-square w-[88px] overflow-hidden rounded-full bg-blush transition-transform duration-200 group-hover:-translate-y-1 small:w-[132px]">
                {t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <PlaceholderArt name={t.name} className="h-full w-full" />
                )}
              </span>
              <span className="text-[13px] font-semibold leading-tight text-ink group-hover:text-peacock-700 small:text-sm">
                {t.name}
              </span>
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
