"use client"

import type { Banner } from "@lib/data/content"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronLeft, ChevronRight } from "@modules/store-ui/icons"
import { useEffect, useState } from "react"

/**
 * Homepage slider. Slides come from Admin → Storefront → Banners
 * (placement "Hero slider"). Without an image a slide uses the store colours.
 */
export default function Hero({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = banners.length

  useEffect(() => {
    if (count < 2 || paused) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000)
    return () => clearInterval(t)
  }, [count, paused])

  if (!count) return null

  const go = (n: number) => setIndex((n + count) % count)

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative overflow-hidden bg-peacock-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((b, i) => (
          <div
            key={b.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            className="relative min-w-full"
          >
            <Slide banner={b} active={i === index} />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink hover:bg-white small:flex"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink hover:bg-white small:flex"
          >
            <ChevronRight />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                onClick={() => go(i)}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                className={clx(
                  "h-2.5 rounded-full transition-all",
                  i === index ? "w-7 bg-zari-300" : "w-2.5 bg-white/60 hover:bg-white"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

const Slide = ({ banner, active }: { banner: Banner; active: boolean }) => {
  const hasImage = !!banner.image_url

  return (
    <div className="relative flex min-h-[360px] items-center small:min-h-[480px]">
      {hasImage ? (
        <picture className="absolute inset-0">
          {banner.mobile_image_url && (
            <source media="(max-width: 640px)" srcSet={banner.mobile_image_url} />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner.image_url!}
            alt=""
            className="h-full w-full object-cover"
            loading={active ? "eager" : "lazy"}
          />
          <span className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
        </picture>
      ) : (
        <BeadPattern />
      )}

      <div className="content-container relative z-10 py-14">
        <div className="max-w-xl">
          <h2 className="heading-display text-[2.1rem] leading-[1.1] text-white small:text-[3.4rem]">
            {banner.title}
          </h2>
          {banner.subtitle && (
            <p className="mt-4 max-w-md text-base leading-7 text-white/85 small:text-lg">
              {banner.subtitle}
            </p>
          )}
          {banner.link && (
            <LocalizedClientLink
              href={banner.link}
              tabIndex={active ? 0 : -1}
              className="mt-8 inline-flex h-12 items-center rounded-full bg-zari-300 px-7 text-sm font-bold text-ink transition-colors hover:bg-white"
            >
              {banner.button_text || "Shop now"}
            </LocalizedClientLink>
          )}
        </div>
      </div>
    </div>
  )
}

/** Decorative strands of beads used when a slide has no photo. */
const BeadPattern = () => (
  <svg
    aria-hidden
    className="absolute inset-0 h-full w-full"
    viewBox="0 0 1200 480"
    preserveAspectRatio="xMidYMid slice"
  >
    <rect width="1200" height="480" fill="#5E2363" />
    {[0, 1, 2, 3].map((row) =>
      Array.from({ length: 22 }, (_, i) => {
        const x = 620 + i * 28
        // Rounded so server and browser render identical values (no hydration mismatch)
        const y = Math.round((70 + row * 110 + Math.sin(i / 2.5 + row) * 26) * 100) / 100
        const big = i % 4 === 0
        return (
          <circle
            key={`${row}-${i}`}
            cx={x}
            cy={y}
            r={big ? 9 : 5}
            fill={big ? "#C9A227" : row % 2 ? "#D9A8E0" : "#E6CB6E"}
            opacity={big ? 0.95 : 0.55}
          />
        )
      })
    )}
  </svg>
)
