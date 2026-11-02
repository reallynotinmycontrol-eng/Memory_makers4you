import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_CONTENT_MODULE } from "../../../../modules/store-content"
import StoreContentModuleService from "../../../../modules/store-content/service"
import { BANNER_FIELDS, pickFields } from "../helpers"

// GET /admin/content/banners
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const content: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )
  const banners = await content.listBanners(
    {},
    { order: { placement: "ASC", rank: "ASC" }, take: 200 }
  )
  res.json({ banners })
}

// POST /admin/content/banners
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const content: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )
  const data = pickFields(req.body as Record<string, unknown>, BANNER_FIELDS, {
    partial: false,
  })
  const banner = await content.createBanners(data as any)
  res.status(201).json({ banner })
}
