import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function AnnouncementBar({
  text,
  link,
}: {
  text?: string
  link?: string
}) {
  if (!text) return null

  const content = (
    <p className="content-container py-2 text-center text-[13px] font-semibold tracking-wide text-white">
      {text}
    </p>
  )

  return (
    <div className="bg-peacock-800">
      {link ? (
        <LocalizedClientLink href={link} className="block hover:underline">
          {content}
        </LocalizedClientLink>
      ) : (
        content
      )}
    </div>
  )
}
