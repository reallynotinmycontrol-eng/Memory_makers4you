import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_CONTENT_MODULE } from "../../../../../modules/store-content"
import StoreContentModuleService from "../../../../../modules/store-content/service"
import { pickFields, SECTION_FIELDS } from "../../helpers"

// POST /admin/content/sections/:id
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const content: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )
  const data = pickFields(req.body as Record<string, unknown>, SECTION_FIELDS, {
    partial: true,
  })
  const section = await content.updateHomeSections({
    id: req.params.id,
    ...data,
  } as any)
  res.json({ section })
}

// DELETE /admin/content/sections/:id
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const content: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )
  await content.deleteHomeSections(req.params.id)
  res.json({ id: req.params.id, deleted: true })
}
