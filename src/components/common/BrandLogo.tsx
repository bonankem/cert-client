import { LOGOS } from '@/config/constants'

interface BrandLogoProps {
  name: keyof typeof LOGOS
  className?: string
}

/** Transparent brand logo from /public/logos — no background or frame. */
export default function BrandLogo({ name, className = '' }: BrandLogoProps) {
  const { src, alt } = LOGOS[name]
  return <img src={src} alt={alt} className={`block w-auto max-w-full ${className}`} />
}
