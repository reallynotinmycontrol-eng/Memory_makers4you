"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import PlaceholderArt from "@modules/store-ui/placeholder-art"
import Image from "next/image"
import { useEffect, useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title?: string
}

/** One large image with a row of thumbnails underneath. */
const ImageGallery = ({ images, title = "Product" }: ImageGalleryProps) => {
  const list = (images ?? []).filter((i) => !!i.url)
  const [active, setActive] = useState(0)

  // Reset when the variant (and therefore the image set) changes.
  useEffect(() => setActive(0), [images])

  if (!list.length) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        <PlaceholderArt name={title} className="absolute inset-0 h-full w-full" />
      </div>
    )
  }

  const current = list[Math.min(active, list.length - 1)]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-blush">
        <Image
          key={current.id}
          src={current.url}
          alt={`${title}, image ${active + 1} of ${list.length}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover"
        />
      </div>

      {list.length > 1 && (
        <ul className="no-scrollbar flex gap-2 overflow-x-auto">
          {list.map((img, i) => (
            <li key={img.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                className={clx(
                  "relative block h-20 w-20 overflow-hidden rounded-lg border-2 bg-blush",
                  i === active ? "border-peacock-700" : "border-transparent hover:border-grey-20"
                )}
              >
                <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ImageGallery
