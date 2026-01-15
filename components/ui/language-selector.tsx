'use client'

import { useI18n } from '@/lib/i18n'
import { Globe } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function LanguageSelector() {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  ]

  const currentLang = languages.find(lang => lang.code === locale) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#262626] rounded-lg',
          'text-white text-sm hover:border-[#333] transition-colors'
        )}
      >
        <Globe className="w-4 h-4 text-[#808080]" />
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.label}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-40 bg-[#1a1a1a] border border-[#262626] rounded-xl shadow-xl z-20 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-3 text-left text-sm hover:bg-[#262626] transition-colors flex items-center gap-3',
                  locale === lang.code ? 'text-[#07F0FF] bg-[#262626]' : 'text-white'
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
