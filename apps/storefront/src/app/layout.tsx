import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Marcellus, Mulish } from "next/font/google"
import "styles/globals.css"

const display = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
})

const body = Mulish({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "MemoryMakers4U"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: `${STORE_NAME} – Jewellery Making & Craft Supplies`,
    template: `%s | ${STORE_NAME}`,
  },
  description:
    "Shop kundan stones, clip stones, beads, chains and jewellery-making supplies online. Shipped across India.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${display.variable} ${body.variable}`}>
      <body className="bg-white text-ink font-sans antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
