import { WhatsappIcon } from "@modules/store-ui/icons"

/**
 * Floating "Chat with us" button. Shown when a WhatsApp number is set in
 * Admin → Storefront → Settings.
 */
export default function WhatsappButton({ number }: { number?: string }) {
  const digits = (number ?? "").replace(/\D/g, "")
  if (!digits) return null

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 left-4 z-40 flex items-center gap-2 rounded-lg bg-[#25D366] px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-[#1ebe5b] small:bottom-6 small:left-6"
    >
      <WhatsappIcon size={22} />
      Chat with us
    </a>
  )
}
