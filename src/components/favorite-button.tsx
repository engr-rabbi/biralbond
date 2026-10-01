'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/lib/favorites-store'
import type { FavItem } from '@/lib/favorites-store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function FavoriteButton({ item, className }: { item: FavItem; className?: string }) {
  const has = useFavorites((s) => s.has)
  const toggle = useFavorites((s) => s.toggle)
  const isFav = has(item.id)

  return (
    <button
      suppressHydrationWarning
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        toggle(item)
        toast(isFav ? 'Removed from favorites' : 'Added to favorites 💜', { description: item.name })
      }}
      className={cn(
        'grid place-items-center rounded-full transition-all',
        isFav
          ? 'bg-accent text-white'
          : 'bg-background/90 text-muted-foreground backdrop-blur hover:text-accent',
        className || 'h-9 w-9'
      )}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={cn('h-4 w-4', isFav && 'fill-white')} />
    </button>
  )
}
