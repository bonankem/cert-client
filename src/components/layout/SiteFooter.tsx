import { ORGANISATION } from '@/config/constants'

const YEAR = new Date().getFullYear()

export default function SiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`px-4 py-5 text-center text-sm opacity-70 ${className}`}>
      © {YEAR} {ORGANISATION.name}. All rights reserved. ·{' '}
      <a href={ORGANISATION.website} target="_blank" rel="noopener noreferrer" className="font-semibold">
        {ORGANISATION.websiteLabel}
      </a>
    </footer>
  )
}
