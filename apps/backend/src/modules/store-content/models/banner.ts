import { model } from "@medusajs/framework/utils"

/**
 * A banner shown on the storefront.
 * - placement "hero": the big slider at the top of the homepage
 * - placement "promo": smaller promotional tiles further down the page
 */
const Banner = model.define("banner", {
  id: model.id({ prefix: "bnr" }).primaryKey(),
  title: model.text(),
  subtitle: model.text().nullable(),
  button_text: model.text().nullable(),
  link: model.text().nullable(),
  image_url: model.text().nullable(),
  mobile_image_url: model.text().nullable(),
  placement: model.enum(["hero", "promo"]).default("hero"),
  rank: model.number().default(0),
  is_active: model.boolean().default(true),
})

export default Banner
