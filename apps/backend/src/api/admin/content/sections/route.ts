import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_CONTENT_MODULE } from "../../../../modules/store-content"
import StoreContentModuleService from "../../../../modules/store-content/service"
import { pickFields, SECTION_FIELDS } from "../helpers"

// GET /admin/content/sections
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const content: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )
  const sections = await content.listHomeSections(
    {},
    { order: { rank: "ASC" }, take: 200 }
  )
  res.json({ sections })
}

// POST /admin/content/sections
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const content: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )
  const data = pickFields(req.body as Record<string, unknown>, SECTION_FIELDS, {
    partial: false,
  })
  const section = await content.createHomeSections(data as any)
  res.status(201).json({ section })
}
