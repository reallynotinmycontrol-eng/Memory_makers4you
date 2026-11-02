import { model } from "@medusajs/framework/utils"

/**
 * A section on the homepage, rendered in `rank` order.
 * - "category_grid": round category tiles. Shows the sub-categories of
 *   `category_handle` (or all top-level categories when empty).
 * - "product_grid": a row of products from `category_handle` or
 *   `collection_handle` (newest products when both are empty).
 */
const HomeSection = model.define("home_section", {
  id: model.id({ prefix: "hsec" }).primaryKey(),
  title: model.text(),
  subtitle: model.text().nullable(),
  type: model.enum(["category_grid", "product_grid"]).default("category_grid"),
  category_handle: model.text().nullable(),
  collection_handle: model.text().nullable(),
  max_items: model.number().default(8),
  rank: model.number().default(0),
  is_active: model.boolean().default(true),
})

export default HomeSection
