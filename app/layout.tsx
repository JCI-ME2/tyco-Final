import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'JCI Security Solutions | Illustra Exacq Kantech and more',
  description: 'Robust, scalable and integrated security solutions — choose Access Control or Video Solutions to begin.',
  generator: 'v0.app',
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/JCI_logo.png`,
    shortcut: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/JCI_logo.png`,
    apple: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/JCI_logo.png`,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
