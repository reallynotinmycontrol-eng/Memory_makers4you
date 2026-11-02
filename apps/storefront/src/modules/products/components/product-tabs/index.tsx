"use client"

import { HttpTypes } from "@medusajs/types"
import Accordion from "./accordion"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
  shippingNote?: string
}

const ProductTabs = ({ product, shippingNote }: ProductTabsProps) => {
  const details = [
    { label: "Material", value: product.material },
    { label: "Weight", value: product.weight ? `${product.weight} g` : null },
    {
      label: "Size",
      value:
        product.length && product.width
          ? `${product.length} × ${product.width}${product.height ? ` × ${product.height}` : ""} mm`
          : null,
    },
    { label: "Type", value: product.type?.value },
  ].filter((d) => !!d.value)

  const tabs = [
    {
      label: "Description",
      content: (
        <div className="whitespace-pre-line pb-6 text-sm leading-7 text-grey-70" data-testid="product-description">
          {product.description || "No description yet."}
          {details.length > 0 && (
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="text-xs text-grey-50">{d.label}</dt>
                  <dd className="font-semibold text-ink">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      ),
    },
    {
      label: "Shipping & returns",
      content: (
        <div className="space-y-2 pb-6 text-sm leading-6 text-grey-70">
          <p>{shippingNote || "Orders are packed within 1–2 working days and shipped across India."}</p>
          <p>Shipping charges are shown at checkout before you pay.</p>
          <p>If an item arrives damaged, contact us within 48 hours with an unboxing video.</p>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple" defaultValue={["Description"]}>
        {tabs.map((tab) => (
          <Accordion.Item key={tab.label} title={tab.label} headingSize="medium" value={tab.label}>
            {tab.content}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

export default ProductTabs
