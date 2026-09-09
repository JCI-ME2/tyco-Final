'use client'

import { usePathname } from 'next/navigation'

export function SiteFooter() {
  const pathname = usePathname()

  if (pathname === '/' || pathname === '/chat') return null

  return (
    <footer className="mt-auto">
      <div className="bg-[#f1f1f1] px-6 py-10 sm:px-12 lg:px-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-5xl font-semibold tracking-[-0.06em] text-[#66686b]">Exacq</div>
          <div className="flex flex-col items-center gap-3 md:mr-auto md:ml-24 md:items-start">
            <span className="text-xl text-[#0b0b0b]">Connect With Us</span>
            <div className="flex items-center gap-8 text-2xl font-bold text-[#005a9c]" aria-label="Social media links">
              <a href="https://www.facebook.com/JohnsonControls" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
              <a href="https://x.com/johnsoncontrols" target="_blank" rel="noreferrer" aria-label="X">♥</a>
              <a href="https://www.linkedin.com/company/johnson-controls" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
              <a href="https://www.youtube.com/@JohnsonControls" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>
            </div>
          </div>
          <div className="flex items-center gap-3 text-right text-[#005a9c]">
            <span className="text-xl font-semibold leading-[0.9]">Johnson<br />Controls</span>
            <span className="text-4xl leading-none text-[#00a4d6]">◒</span>
          </div>
        </div>
      </div>
      <div className="bg-background px-6 py-4 text-xs text-[#002f55] sm:px-12 lg:px-6">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 lg:flex-row">
          <span>© 2026 Johnson Controls. All rights reserved.</span>
          <span>Page loaded from en.exacq.com in 0.6757 seconds</span>
          <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2" aria-label="Legal links">
            <a href="#legal">Legal</a><span>|</span><a href="#privacy">Privacy Center</a><span>|</span><a href="#news">News</a><span>|</span><a href="#media">Media Archive</a><span>|</span><a href="#cookies">Cookie Preferences</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
