import type { Metadata } from 'next'
import { Noto_Sans, Noto_Sans_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _notoSans = Noto_Sans({ subsets: ["latin"] });
const _notoSansMono = Noto_Sans_Mono({ subsets: ["latin"] });
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const metadata: Metadata = {
  title: 'JCI Security Solutions',
  description: 'Robust, scalable and integrated security solutions — choose Access Control or Video Solutions to begin.',
  generator: 'v0.app',
  icons: {
    icon: `${basePath}/JCI_logo.png`,
    shortcut: `${basePath}/JCI_logo.png`,
    apple: `${basePath}/apple-icon.png`,
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
