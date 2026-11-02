import { clx } from "@medusajs/ui"
import PlaceholderArt from "@modules/store-ui/placeholder-art"
import Image from "next/image"
import React from "react"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  /** Product name, used for alt text and the placeholder artwork. */
  alt?: string
  "data-testid"?: string
}

/** Square product image (craft supplies photograph best square). */
const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  className,
  alt = "Product",
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={clx(
        "relative aspect-square w-full overflow-hidden rounded-lg bg-blush",
        className,
        {
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full" || size === "square",
        }
      )}
      data-testid={dataTestid}
    >
      {initialImage ? (
        <Image
          src={initialImage}
          alt={alt}
          className="absolute inset-0 object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
          draggable={false}
          quality={60}
          sizes="(max-width: 576px) 50vw, (max-width: 1024px) 33vw, 300px"
          fill
        />
      ) : (
        <PlaceholderArt name={alt} className="absolute inset-0 h-full w-full" />
      )}
    </div>
  )
}

export default Thumbnail
