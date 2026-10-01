'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FavItem = {
  id: string
  type: 'breed' | 'product' | 'adoption' | 'article' | 'vet'
  name: string
  subtitle: string
  meta?: string
  href: string
}

type FavState = {
  items: FavItem[]
  isOpen: boolean
  add: (item: FavItem) => void
  remove: (id: string) => void
  has: (id: string) => boolean
  toggle: (item: FavItem) => void
  clear: () => void
  open: () => void
  close: () => void
}

export const useFavorites = create<FavState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (item) =>
        set((s) => {
          if (s.items.find((i) => i.id === item.id)) return s
          return { items: [...s.items, item] }
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      has: (id) => !!get().items.find((i) => i.id === id),
      toggle: (item) =>
        set((s) => {
          const exists = s.items.find((i) => i.id === item.id)
          if (exists) return { items: s.items.filter((i) => i.id !== item.id) }
          return { items: [...s.items, item] }
        }),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: 'biralbond-favorites' }
  )
)
