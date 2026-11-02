import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_CONTENT_MODULE } from "../../../../modules/store-content"
import StoreContentModuleService from "../../../../modules/store-content/service"
import { SETTING_KEYS } from "../helpers"

// GET /admin/content/settings
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const content: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )
  res.json({ settings: await content.getSettingsMap(), keys: SETTING_KEYS })
}

// POST /admin/content/settings  body: { settings: { key: value } }
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const content: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )
  const incoming =
    ((req.body as Record<string, unknown>)?.settings as Record<string, unknown>) ??
    {}

  const values: Record<string, string | null> = {}
  for (const key of SETTING_KEYS) {
    if (Object.prototype.hasOwnProperty.call(incoming, key)) {
      const v = incoming[key]
      values[key] = v === null || v === undefined ? null : String(v).trim()
    }
  }

  const settings = await content.upsertSettings(values)
  res.json({ settings })
}
