import type { ReactNode } from 'react'
import BrandLogo from '@/components/common/BrandLogo'
import ThemeSwitcher from '@/components/common/ThemeSwitcher'
import HeroBackdrop from './hero/HeroBackdrop'

export interface HeroProps {
  /** Main title (white). */
  title: string
  /** Second line of the title, in the brand accent. */
  titleAccent?: string
  /** Small pill above the title. */
  eyebrow?: { icon?: ReactNode; label: string }
  description?: string
  /** Illustration on the right (hidden on small screens). */
  aside?: ReactNode
  /** Full-width glass panel at the bottom of the hero. */
  footer?: ReactNode
  /** Taller hero with more room between the top bar and the title (e.g. sign-in). */
  tall?: boolean
}

export default function HeaderBand({ title, titleAccent, eyebrow, description, aside, footer, tall }: HeroProps) {
  return (
    <header className={`hero-bg relative overflow-hidden px-4 pt-5 text-white ${tall ? 'pb-24 sm:pb-28' : 'pb-16'}`}>
      <HeroBackdrop />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo name="zoracom" className="h-5 sm:h-6" />
          <ThemeSwitcher className="hero-switch text-xs" />
        </div>

        <div className={`${tall ? 'mt-12 sm:mt-20' : 'mt-3 sm:mt-4'} grid items-center gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_26rem]`}>
          <div className="min-w-0">
            {eyebrow && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky/30 bg-sky/10 px-2.5 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-semibold text-[#5fd0ff] backdrop-blur-sm">
                {eyebrow.icon}
                {eyebrow.label}
              </span>
            )}
            <h1 className={`${eyebrow ? 'mt-2.5 sm:mt-3' : 'mt-0'} mb-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[1.12] font-extrabold tracking-tight`}>
              <span className="bg-linear-to-b from-white to-[#cfe0ff] bg-clip-text text-transparent">{title}</span>
              {titleAccent && (
                <span className="block bg-linear-to-r from-[#22c3ff] to-[#5fd0ff] bg-clip-text text-transparent">
                  {titleAccent}
                </span>
              )}
            </h1>
            {description && (
              <p className="mt-2.5 sm:mt-3 mb-0 max-w-[56ch] border-l-[3px] border-sky pl-3 text-xs sm:text-sm md:text-[15px] leading-relaxed text-band-text">
                {description}
              </p>
            )}
          </div>
          {aside && <div className="relative hidden w-full lg:block">{aside}</div>}
        </div>

        {footer && <div className="mx-auto mt-4 w-full max-w-[43rem]">{footer}</div>}
      </div>
    </header>
  )
}
