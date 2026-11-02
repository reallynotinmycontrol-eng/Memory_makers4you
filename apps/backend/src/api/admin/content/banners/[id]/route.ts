import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_CONTENT_MODULE } from "../../../../../modules/store-content"
import StoreContentModuleService from "../../../../../modules/store-content/service"
import { BANNER_FIELDS, pickFields } from "../../helpers"

// POST /admin/content/banners/:id
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const content: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )
  const data = pickFields(req.body as Record<string, unknown>, BANNER_FIELDS, {
    partial: true,
  })
  const banner = await content.updateBanners({ id: req.params.id, ...data } as any)
  res.json({ banner })
}

// DELETE /admin/content/banners/:id
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const content: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )
  await content.deleteBanners(req.params.id)
  res.json({ id: req.params.id, deleted: true })
}
