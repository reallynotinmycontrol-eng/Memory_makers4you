import type { CategoryTile } from "@lib/data/catalog"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PlaceholderArt from "@modules/store-ui/placeholder-art"
import SectionHeading from "../section-heading"

/**
 * Grid of square category photos with the name underneath:
 * 2 per row on phones, 3 on tablets, 6 on desktop.
 * Photo = category metadata `image_url`, otherwise a product photo.
 */
export default function CategoryGrid({
  title,
  subtitle,
  tiles,
}: {
  title?: string
  subtitle?: string | null
  tiles: CategoryTile[]
  viewAllHref?: string
}) {
  if (!tiles.length) return null

  return (
    <section className="content-container py-10 small:py-14">
      {title && <SectionHeading title={title} subtitle={subtitle} />}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-7 xsmall:grid-cols-3 small:grid-cols-6 small:gap-x-9 small:gap-y-10">
        {tiles.map((t) => (
          <li key={t.id}>
            <LocalizedClientLink href={`/categories/${t.handle}`} className="group block text-center">
              <span className="relative block aspect-square w-full overflow-hidden bg-blush">
                {t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <PlaceholderArt name={t.name} className="h-full w-full" />
                )}
              </span>
              <span className="mt-3 block text-[15px] font-semibold leading-snug text-ink group-hover:text-clay-600 small:text-base">
                {t.name}
              </span>
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
