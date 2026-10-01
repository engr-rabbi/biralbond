'use client'

import * as React from 'react'
import { Languages, Check, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { useLanguage } from '@/components/language-provider'
import type { Lang } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const LANGUAGES: { value: Lang; label: string; nativeLabel: string; flag: string }[] = [
  { value: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', flag: '🇧🇩' },
  { value: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
]

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  const current = LANGUAGES.find((l) => l.value === lang) || LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 rounded-full px-2 text-sm font-medium sm:px-3"
          aria-label="Switch language"
        >
          <Globe className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">{current.nativeLabel}</span>
          <span className="sm:hidden">{current.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="flex items-center gap-1.5 text-xs">
          <Languages className="h-3.5 w-3.5" /> Language / ভাষা
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.value}
            onClick={() => setLang(l.value)}
            className={cn(
              'flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2',
              lang === l.value && 'bg-primary/10'
            )}
          >
            <span className="text-lg">{l.flag}</span>
            <div className="flex flex-1 flex-col">
              <span className={cn('text-sm font-semibold leading-none', lang === l.value && 'text-primary')}>
                {l.nativeLabel}
              </span>
              <span className="text-[10px] text-muted-foreground">{l.label}</span>
            </div>
            {lang === l.value && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
