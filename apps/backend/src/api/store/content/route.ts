import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_CONTENT_MODULE } from "../../../modules/store-content"
import StoreContentModuleService from "../../../modules/store-content/service"

/**
 * GET /store/content
 * Everything the storefront needs to render the dynamic parts of the site:
 * settings (announcement bar, contact info, social links), banners and
 * homepage sections. Only active items are returned.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const content: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )

  const [settings, banners, sections] = await Promise.all([
    content.getSettingsMap(),
    content.listBanners({ is_active: true }, { order: { rank: "ASC" }, take: 50 }),
    content.listHomeSections(
      { is_active: true },
      { order: { rank: "ASC" }, take: 50 }
    ),
  ])

  res.json({ settings, banners, sections })
}
