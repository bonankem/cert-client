import type { ReactNode } from 'react'
import HeaderBand, { type HeroProps } from './HeaderBand'
import SiteFooter from './SiteFooter'

interface PageLayoutProps extends HeroProps {
  children: ReactNode
}

/** Public pages: brand hero, a content column that overlaps it, and the site footer. */
export default function PageLayout({ children, ...hero }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderBand {...hero} />
      <main className="relative z-20 mx-auto -mt-12 flex w-full max-w-180 flex-1 flex-col gap-4 px-4">
        {/* Subtle decorative gradient orange aura near the form card */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-4 sm:right-4 size-48 rounded-full bg-gradient-to-tr from-[#f26a21]/22 via-[#ff7a00]/14 to-amber-300/10 blur-2xl"
        />
        {children}
      </main>
      <SiteFooter className="mt-6" />
    </div>
  )
}
