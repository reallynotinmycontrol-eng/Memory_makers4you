import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <fieldset className="flex flex-col gap-y-2.5">
      <legend className="mb-2.5 text-sm text-grey-60">
        {title}: <span className="font-semibold text-ink">{current ?? "choose one"}</span>
      </legend>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {filteredOptions.map((v) => {
          const selected = v === current
          return (
            <button
              type="button"
              onClick={() => updateOption(option.id, v)}
              key={v}
              aria-pressed={selected}
              className={clx(
                "h-10 min-w-[3rem] rounded-full border px-4 text-sm font-semibold transition-colors disabled:opacity-50",
                selected
                  ? "border-peacock-700 bg-peacock-700 text-white"
                  : "border-grey-20 bg-white text-ink hover:border-peacock-700"
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default OptionSelect
