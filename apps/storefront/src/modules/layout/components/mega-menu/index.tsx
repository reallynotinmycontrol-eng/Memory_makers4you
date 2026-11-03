import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronDown } from "@modules/store-ui/icons"

type Tree = (HttpTypes.StoreProductCategory & {
  category_children: HttpTypes.StoreProductCategory[]
})[]

/**
 * Desktop category bar. Each top-level category opens a panel listing its
 * sub-categories on hover or keyboard focus. Built from Admin → Categories.
 */
export default function MegaMenu({ tree }: { tree: Tree }) {
  if (!tree.length) return null

  return (
    <nav aria-label="Categories" className="relative hidden small:block border-t border-grey-10">
      {/* One line only: categories that don't fit wrap onto a hidden second
          line, and every category is always reachable from "All Categories". */}
      <ul className="content-container flex h-11 flex-wrap items-center justify-center gap-x-1 overflow-hidden">
        <li className="group">
          <LocalizedClientLink
            href="/store"
            className="flex items-center gap-1 px-4 py-3 text-sm font-semibold text-peacock-700"
          >
            All Categories
            <ChevronDown size={14} />
          </LocalizedClientLink>
          <div className="invisible absolute left-1/2 top-full z-40 -translate-x-1/2 pt-1 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            <div className="w-[min(960px,94vw)] rounded-xl border border-grey-10 bg-white p-6 shadow-lg">
              <ul className="grid grid-cols-4 gap-x-6 gap-y-2">
                {tree.map((cat) => (
                  <li key={cat.id}>
                    <LocalizedClientLink
                      href={`/categories/${cat.handle}`}
                      className="block py-1 text-sm text-grey-60 hover:text-peacock-700"
                    >
                      {cat.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>
        {tree.map((cat) => {
          const children = cat.category_children ?? []
          return (
            // Panels are positioned against the <nav>, centred under the whole
            // bar, so menus near the edges never overflow the viewport.
            <li key={cat.id} className="group">
              <LocalizedClientLink
                href={`/categories/${cat.handle}`}
                className="flex items-center gap-1 px-4 py-3 text-sm font-semibold text-ink transition-colors hover:text-peacock-700 group-focus-within:text-peacock-700"
              >
                {cat.name}
                {children.length > 0 && <ChevronDown size={14} />}
              </LocalizedClientLink>

              {children.length > 0 && (
                <div className="invisible absolute left-1/2 top-full z-40 -translate-x-1/2 pt-1 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="w-[min(640px,90vw)] rounded-xl border border-grey-10 bg-white p-6 shadow-lg">
                    <div className="mb-4 flex items-baseline justify-between border-b border-grey-10 pb-3">
                      <p className="heading-display text-lg">{cat.name}</p>
                      <LocalizedClientLink
                        href={`/categories/${cat.handle}`}
                        className="text-sm font-semibold text-peacock-700 hover:underline"
                      >
                        View all
                      </LocalizedClientLink>
                    </div>
                    <ul className="grid grid-cols-3 gap-x-6 gap-y-2">
                      {children.map((child) => (
                        <li key={child.id}>
                          <LocalizedClientLink
                            href={`/categories/${child.handle}`}
                            className="block py-1 text-sm text-grey-60 hover:text-peacock-700"
                          >
                            {child.name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
