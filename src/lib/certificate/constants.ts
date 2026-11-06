/** Landscape A4 at ~205 dpi. */
export const CANVAS_SIZE = { width: 2400, height: 1697 } as const

export const CERT_FONTS = {
  sans: "Raleway, 'Segoe UI', Arial, sans-serif",
  script: "'Great Vibes', 'Brush Script MT', cursive",
} as const

/** Font faces that must be loaded before drawing to canvas. */
export const FONT_FACES = [
  '800 100px Raleway',
  'italic 800 100px Raleway',
  '700 100px Raleway',
  '600 40px Raleway',
  '500 40px Raleway',
  "400 100px 'Great Vibes'",
] as const

/** Certificate palette (fixed — the certificate is always printed light). */
export const CERT_COLORS = {
  card: '#ffffff',
  panel: ['#fbfdff', '#e8f2fc'],
  frameInner: '#2a9be0',
  ink: '#0b1f4b',
  muted: '#33456b',
  accent: '#1aa3ea',
  accentDark: '#0a5cc2',
  nameFrom: '#1197e8',
  nameTo: '#0a62c4',
  waves: '#8fc2ee',
  gold: ['#ffd25a', '#e8900f'],
  orange: ['#ffb300', '#f57c00'],
  blueDeep: '#0b5cab',
  blueMid: '#1677d6',
  blueLight: '#4fc3f7',
} as const

/** Positions and sizes (canvas pixels). */
export const LAYOUT = {
  card: { inset: 0, radius: 0 },
  frame: { outer: 0, inner: 0, notch: 60 },
  logo: { y: 142, height: 88 },
  qr: { size: 196, right: 0, top: 1120 },
  title: { y: 350, size: 108, maxWidth: 1450 },
  laurel: { offset: 930, y: 330, height: 170 },
  dashesY: 388,
  intro: { cy: 532, width: 880, height: 74 },
  name: { cy: 646, width: 1620, height: 166, tip: 70 },
  orgLineY: 792,
  course: { cy: 890, width: 1300, height: 98, skew: 46 },
  scopeY: 998,
  stablenet: { y: 1410, height: 72 },
  footerLineY: 1240,
  signatureX: 600,
  detailsX: 1810,
} as const
