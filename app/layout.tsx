import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SiteFooter } from '@/components/site-footer'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Tyco Solutions – Exacq, Kantech & Illustra',
  description: 'Robust, scalable and integrated security solutions — choose Access Control or Video Solutions to begin.',
  generator: 'v0.app',
  icons: {
    icon: '/JCI_logo.png',
    shortcut: '/JCI_logo.png',
    apple: '/JCI_logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        {children}
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
