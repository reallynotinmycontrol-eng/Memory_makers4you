import { MedusaError } from "@medusajs/framework/utils"

type FieldType = "string" | "number" | "boolean" | "enum"

type FieldSpec = {
  type: FieldType
  required?: boolean
  values?: string[]
}

/**
 * Picks only the allowed fields from a request body and checks their types,
 * so the admin API never writes unexpected columns.
 */
export function pickFields(
  body: Record<string, unknown> | undefined,
  spec: Record<string, FieldSpec>,
  { partial }: { partial: boolean }
): Record<string, unknown> {
  const input = body ?? {}
  const out: Record<string, unknown> = {}

  for (const [key, rule] of Object.entries(spec)) {
    const has = Object.prototype.hasOwnProperty.call(input, key)

    if (!has) {
      if (rule.required && !partial) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `"${key}" is required`
        )
      }
      continue
    }

    let value = input[key]

    if (value === "" || value === undefined) {
      value = null
    }

    if (value === null) {
      if (rule.required) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `"${key}" cannot be empty`
        )
      }
      out[key] = null
      continue
    }

    switch (rule.type) {
      case "string":
        out[key] = String(value).trim()
        break
      case "number": {
        const n = Number(value)
        if (Number.isNaN(n)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `"${key}" must be a number`
          )
        }
        out[key] = Math.round(n)
        break
      }
      case "boolean":
        out[key] = value === true || value === "true"
        break
      case "enum":
        if (!rule.values?.includes(String(value))) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `"${key}" must be one of: ${rule.values?.join(", ")}`
          )
        }
        out[key] = String(value)
        break
    }
  }

  return out
}

export const BANNER_FIELDS: Record<string, FieldSpec> = {
  title: { type: "string", required: true },
  subtitle: { type: "string" },
  button_text: { type: "string" },
  link: { type: "string" },
  image_url: { type: "string" },
  mobile_image_url: { type: "string" },
  placement: { type: "enum", values: ["hero", "promo"] },
  rank: { type: "number" },
  is_active: { type: "boolean" },
}

export const SECTION_FIELDS: Record<string, FieldSpec> = {
  title: { type: "string", required: true },
  subtitle: { type: "string" },
  type: { type: "enum", values: ["category_grid", "product_grid"] },
  category_handle: { type: "string" },
  collection_handle: { type: "string" },
  max_items: { type: "number" },
  rank: { type: "number" },
  is_active: { type: "boolean" },
}

/** Setting keys the admin page can edit. */
export const SETTING_KEYS = [
  "store_name",
  "logo_url",
  "announcement_text",
  "announcement_link",
  "phone",
  "email",
  "whatsapp",
  "address",
  "instagram_url",
  "facebook_url",
  "youtube_url",
  "footer_about",
  "shipping_note",
]
