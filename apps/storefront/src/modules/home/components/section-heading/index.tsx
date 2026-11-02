import LocalizedClientLink from "@modules/common/components/localized-client-link"

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
    <div className="mb-6 flex items-end justify-between gap-4 small:mb-8">
      <div>
        <h2 className="heading-display text-2xl small:text-[2rem]">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-grey-50">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <LocalizedClientLink
          href={viewAllHref}
          className="shrink-0 text-sm font-semibold text-peacock-700 underline-offset-4 hover:underline"
        >
          View all
        </LocalizedClientLink>
      )}
    </div>
  )
}
