import { sdk } from "@lib/config"

export type Banner = {
  id: string
  title: string
  subtitle?: string | null
  button_text?: string | null
  link?: string | null
  image_url?: string | null
  mobile_image_url?: string | null
  placement: "hero" | "promo"
  rank: number
}

export type HomeSection = {
  id: string
  title: string
  subtitle?: string | null
  type: "category_grid" | "product_grid"
  category_handle?: string | null
  collection_handle?: string | null
  max_items: number
  rank: number
}

export type SiteSettings = Partial<
  Record<
    | "store_name"
    | "logo_url"
    | "announcement_text"
    | "announcement_link"
    | "phone"
    | "email"
    | "whatsapp"
    | "address"
    | "instagram_url"
    | "facebook_url"
    | "youtube_url"
    | "footer_about"
    | "shipping_note",
    string
  >
>

export type StoreContent = {
  settings: SiteSettings
  banners: Banner[]
  sections: HomeSection[]
}

const EMPTY: StoreContent = { settings: {}, banners: [], sections: [] }

/**
 * Banners, homepage sections and site settings edited in
 * Admin → Storefront. Refreshed every 60 seconds.
 */
export const getStoreContent = async (): Promise<StoreContent> => {
  try {
    const content = await sdk.client.fetch<StoreContent>("/store/content", {
      next: { revalidate: 60, tags: ["store-content"] },
      cache: "force-cache",
    })
    return {
      settings: content.settings ?? {},
      banners: content.banners ?? [],
      sections: content.sections ?? [],
    }
  } catch {
    return EMPTY
  }
}

export const getStoreName = async () => {
  const { settings } = await getStoreContent()
  return settings.store_name || process.env.NEXT_PUBLIC_STORE_NAME || "MemoryMakers4U"
}
