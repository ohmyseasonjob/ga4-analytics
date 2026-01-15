'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import { LanguageSelector } from '@/components/ui/language-selector'

const navItems = [
  { href: '/ga4', key: 'dashboard.ga4', color: 'bg-oms-yellow' },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo_white.png"
                alt="OhMySeason"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
              {/* Auth Status Badge */}
              {status === 'authenticated' ? (
                <span className="px-2 py-0.5 text-xs bg-oms-green/20 text-oms-green rounded-full">
                  {t('common.liveData')}
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs bg-oms-yellow/20 text-oms-yellow rounded-full">
                  {t('common.mockData')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              {/* Login/Logout Button */}
              {status === 'authenticated' ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary">
                    {session.user?.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1.5 text-sm bg-card hover:bg-card-hover border border-border rounded-lg text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {t('common.logout')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn('google')}
                  className="px-4 py-1.5 text-sm bg-oms-green hover:bg-oms-green/80 text-background font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t('common.login')}
                </button>
              )}
            </div>
          </div>
          
          {/* Subtitle */}
          {(title || subtitle) && (
            <p className="text-text-muted text-sm mt-2">
              {title && <span>Analytics Dashboard</span>}
              {subtitle && <span> • {subtitle}</span>}
            </p>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center gap-2 py-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-card-hover border border-border-light text-text-primary'
                      : 'text-text-muted hover:text-text-primary hover:bg-card'
                  )}
                >
                  <span className={cn('w-2 h-2 rounded-full', item.color)} />
                  {t(item.key)}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-[1440px] mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  )
}
