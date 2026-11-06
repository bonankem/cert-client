/**
 * Decorative hero layers: left brand waves, a guilloche rosette (the engraved
 * security pattern found on printed certificates) and a dot grid.
 */

const TAU = Math.PI * 2
const STEPS = 720

/** One closed guilloche strand: a circle of radius `base` modulated by a sine wave. */
const strand = (base: number, amp: number, waves: number, phase: number) => {
  let d = ''
  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * TAU
    const r = base + amp * Math.sin(waves * t + phase)
    d += `${i ? 'L' : 'M'}${(100 + r * Math.cos(t)).toFixed(2)} ${(100 + r * Math.sin(t)).toFixed(2)}`
  }
  return `${d}Z`
}

/** A band of strands with evenly offset phases, so they weave into each other. */
const band = (base: number, amp: number, waves: number, strands: number) =>
  Array.from({ length: strands }, (_, s) => strand(base, amp, waves, (s * TAU) / strands))

/** Inner rosette: a rose curve layered with rotated copies. */
const rosette = (base: number, amp: number, petals: number, copies: number) =>
  Array.from({ length: copies }, (_, c) => {
    const rot = (c * TAU) / (petals * copies)
    let d = ''
    for (let i = 0; i <= STEPS; i++) {
      const t = (i / STEPS) * TAU
      const r = base + amp * Math.cos(petals * t)
      d += `${i ? 'L' : 'M'}${(100 + r * Math.cos(t + rot)).toFixed(2)} ${(100 + r * Math.sin(t + rot)).toFixed(2)}`
    }
    return `${d}Z`
  })

const OUTER = band(86, 4, 36, 4)
const MIDDLE = band(64, 7, 20, 3)
const INNER = rosette(28, 16, 8, 3)
const TICKS = Array.from({ length: 120 }, (_, i) => {
  const a = (i / 120) * TAU
  const r1 = i % 5 === 0 ? 92 : 94
  return `M${(100 + r1 * Math.cos(a)).toFixed(2)} ${(100 + r1 * Math.sin(a)).toFixed(2)}L${(100 + 97 * Math.cos(a)).toFixed(2)} ${(100 + 97 * Math.sin(a)).toFixed(2)}`
}).join('')

export default function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Brand blue waves (left) */}
      <svg
        className="absolute -top-10 -left-20 h-[130%] w-[46rem] opacity-70"
        viewBox="0 0 700 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="hb-wave" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00a9e8" stopOpacity="0.55" />
            <stop offset="0.6" stopColor="#0b4a8f" stopOpacity="0.15" />
            <stop offset="1" stopColor="#0b2a5b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 0 H330 C260 80 300 170 190 240 C90 300 60 420 0 520 Z" fill="url(#hb-wave)" />
        <path d="M0 140 C120 120 170 230 120 330 C80 410 40 470 0 520 Z" fill="#00a9e8" opacity="0.12" />
      </svg>

      {/* Guilloche rosette (top right), fading out toward the content */}
      <svg
        className="absolute -top-24 -right-16 size-72 sm:-top-28 sm:right-4 sm:size-[26rem]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="#f26a21"
        strokeLinecap="round"
      >
        <defs>
          <radialGradient id="hb-fade" cx="70%" cy="25%" r="80%">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="hb-mask">
            <rect width="200" height="200" fill="url(#hb-fade)" />
          </mask>
        </defs>
        <g mask="url(#hb-mask)">
          <circle cx="100" cy="100" r="98.5" strokeWidth="0.5" strokeOpacity="0.5" />
          <path d={TICKS} strokeWidth="0.45" strokeOpacity="0.45" />
          <g strokeWidth="0.45" strokeOpacity="0.55">
            {OUTER.map((d, i) => <path key={i} d={d} />)}
          </g>
          <circle cx="100" cy="100" r="76" strokeWidth="0.4" strokeOpacity="0.35" />
          <g strokeWidth="0.45" strokeOpacity="0.5">
            {MIDDLE.map((d, i) => <path key={i} d={d} />)}
          </g>
          <g strokeWidth="0.4" strokeOpacity="0.45">
            {INNER.map((d, i) => <path key={i} d={d} />)}
          </g>
          <circle cx="100" cy="100" r="4" fill="#f26a21" fillOpacity="0.55" stroke="none" />
        </g>
      </svg>

      {/* Fine dot grid */}
      <div className="hero-dots absolute inset-0 opacity-80" />
    </div>
  )
}
