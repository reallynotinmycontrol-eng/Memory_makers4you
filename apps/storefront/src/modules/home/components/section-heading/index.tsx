import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Centered section title with a short line on each side, e.g.
 *   ———  Silk Thread Materials  ———
 */
export default function SectionHeading({
  title,
  subtitle,
  viewAllHref,
}: {
  title: string
  subtitle?: string | null
  viewAllHref?: string
}) {
  return (
    <div className="mb-8 text-center small:mb-10">
      <div className="flex items-center justify-center gap-4 small:gap-8">
        <span aria-hidden className="h-0.5 w-10 shrink-0 bg-clay-500 small:w-20" />
        <h2 className="font-display text-[1.6rem] leading-tight text-clay-600 small:text-[2.4rem]">
          {title}
        </h2>
        <span aria-hidden className="h-0.5 w-10 shrink-0 bg-clay-500 small:w-20" />
      </div>
      {subtitle && <p className="mt-2 text-sm text-grey-50">{subtitle}</p>}
      {viewAllHref && (
        <LocalizedClientLink
          href={viewAllHref}
          className="mt-2 inline-block text-sm font-semibold text-clay-600 underline-offset-4 hover:underline"
        >
          View all
        </LocalizedClientLink>
      )}
    </div>
  )
}
