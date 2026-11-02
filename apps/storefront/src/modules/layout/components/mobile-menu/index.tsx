"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronDown, CloseIcon, MenuIcon } from "@modules/store-ui/icons"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type Tree = (HttpTypes.StoreProductCategory & {
  category_children: HttpTypes.StoreProductCategory[]
})[]

export const MobileMenuButton = ({ tree, storeName }: { tree: Tree; storeName: string }) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close the drawer after navigating.
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-blush small:hidden"
      >
        <MenuIcon />
      </button>
      {open && <MobileMenu tree={tree} storeName={storeName} onClose={() => setOpen(false)} />}
    </>
  )
}

export const MobileMenu = ({
  tree,
  storeName,
  onClose,
}: {
  tree: Tree
  storeName: string
  onClose: () => void
}) => {
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] small:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button aria-label="Close menu" className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-grey-10 px-4 py-3">
          <span className="heading-display text-lg">{storeName}</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-blush"
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Categories" className="flex-1 overflow-y-auto">
          <ul>
            {tree.map((cat) => {
              const children = cat.category_children ?? []
              const isOpen = expanded === cat.id
              return (
                <li key={cat.id} className="border-b border-grey-10">
                  <div className="flex items-center">
                    <LocalizedClientLink
                      href={`/categories/${cat.handle}`}
                      className="flex-1 px-4 py-3.5 text-[15px] font-semibold"
                    >
                      {cat.name}
                    </LocalizedClientLink>
                    {children.length > 0 && (
                      <button
                        onClick={() => setExpanded(isOpen ? null : cat.id)}
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? "Hide" : "Show"} ${cat.name} sub-categories`}
                        className="flex h-12 w-12 items-center justify-center text-grey-50"
                      >
                        <ChevronDown className={isOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                      </button>
                    )}
                  </div>
                  {isOpen && (
                    <ul className="bg-blush pb-2">
                      {children.map((child) => (
                        <li key={child.id}>
                          <LocalizedClientLink
                            href={`/categories/${child.handle}`}
                            className="block px-8 py-2.5 text-sm text-grey-70"
                          >
                            {child.name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="grid grid-cols-2 gap-2 border-t border-grey-10 p-4">
          <LocalizedClientLink href="/account" className="btn-outline h-10 text-sm">
            My account
          </LocalizedClientLink>
          <LocalizedClientLink href="/wishlist" className="btn-outline h-10 text-sm">
            Wishlist
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
