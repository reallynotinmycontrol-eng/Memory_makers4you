"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

/**
 * Wishlist saved in the visitor's browser (no login needed).
 * Stores product ids only; the wishlist page loads fresh prices and stock.
 */
type WishlistContextValue = {
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
  remove: (id: string) => void
}

const STORAGE_KEY = "craftstore_wishlist"

const WishlistContext = createContext<WishlistContextValue | null>(null)

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setIds(JSON.parse(raw))
    } catch {}
  }, [])

  const persist = (next: string[]) => {
    setIds(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }

  const has = useCallback((id: string) => ids.includes(id), [ids])

  const toggle = (id: string) =>
    persist(ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids])

  const remove = (id: string) => persist(ids.filter((x) => x !== id))

  return (
    <WishlistContext.Provider value={{ ids, has, toggle, remove }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    // Allows components to render outside the provider (e.g. checkout).
    return { ids: [], has: () => false, toggle: () => {}, remove: () => {} }
  }
  return ctx
}
