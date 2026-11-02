import { model } from "@medusajs/framework/utils"

/**
 * Simple key/value settings for the storefront, e.g. the announcement bar
 * text, contact details, social links and footer text.
 */
const SiteSetting = model.define("site_setting", {
  id: model.id({ prefix: "sset" }).primaryKey(),
  key: model.text().unique(),
  value: model.text().nullable(),
})

export default SiteSetting
