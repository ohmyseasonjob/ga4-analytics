import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'OhMySeason Dashboard',
  description: 'Analytics Dashboard for OhMySeason - Seasonal Recruitment Platform',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://ohmyseason-dashboard.vercel.app'),
  openGraph: {
    title: 'OhMySeason Dashboard',
    description: 'Analytics Dashboard for OhMySeason - Seasonal Recruitment Platform',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
