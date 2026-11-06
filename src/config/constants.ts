import type { CertificateSettings } from '@/types'

/** Kept in the browser: the participant's own submission (to re-open their certificate) and the theme choice. */
export const STORAGE_KEYS = {
  mySubmission: 'stablenet-feedback-submission',
  theme: 'stablenet-theme',
} as const

/** Served from client/public. */
export const LOGOS = {
  zoracom: { src: '/logos/zoracom.png', alt: 'Zoracom' },
  stablenet: { src: '/logos/stablenet.png', alt: 'StableNet powered by Infosim' },
  mark: { src: '/logos/mark.png', alt: 'Zoracom' },
} as const

export const ORGANISATION = {
  name: 'Zoracom',
  legalName: 'Zora Communications Ltd',
  website: 'https://www.zoracom.com',
  websiteLabel: 'www.zoracom.com',
} as const

export const COURSE = {
  title: '5-Day StableNet Training',
  scope: 'StableNet (Basic & Advanced)',
  certificateName: 'Zoracom StableNet Training Certificate (Basic & Advanced)',
} as const

export const TRAINER = {
  defaultName: 'StableNet Trainer',
  title: 'StableNet Certified Train the Trainer (TTT)',
} as const

export const CERTIFICATE_DESIGNS = [
  {
    id: 'classic',
    name: 'Minimalist Certificate',
    label: 'Minimalist Variant',
    description: 'Clean official certificate with security border, guilloche rosettes, and QR verification.',
    tag: 'Minimalist',
  },
  {
    id: 'modern',
    name: 'Styled Certificate',
    label: 'Styled Variant',
    description: 'Contemporary design with straight full-bleed geometric accents, wave texture, and gold laurels.',
    tag: 'Styled',
  },
] as const

export const DEFAULT_SETTINGS: Readonly<CertificateSettings> = Object.freeze({
  trainerName: '',
  startDate: '',
  endDate: '',
  signature: '',
  designVariant: 'classic',
})

export const PASSWORD_MIN_LENGTH = 10
