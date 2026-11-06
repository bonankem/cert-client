/**
 * Hero illustration of what this page does: the feedback form you fill in sits
 * behind the certificate it issues. The certificate mirrors the real one
 * (blue frame, name, StableNet ribbon, signature, date, scan-to-verify QR).
 * Pure SVG, crisp at any size.
 */

const SEAL_TEETH = 18

/** Points for the seal's scalloped edge. */
const sealEdge = (cx: number, cy: number, outer: number, inner: number) =>
  Array.from({ length: SEAL_TEETH * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner
    const a = (i * Math.PI) / SEAL_TEETH
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')

/** A small, fixed QR-like pattern: three finder squares plus pseudo-random modules. */
const QR_SIZE = 21
const QR_CELLS = (() => {
  const finder = (x: number, y: number) => x < 8 && y < 8
  const inFinder = (x: number, y: number) =>
    finder(x, y) || finder(QR_SIZE - 1 - x, y) || finder(x, QR_SIZE - 1 - y)
  const cells: string[] = []
  let seed = 7
  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      if (!inFinder(x, y) && seed % 100 < 46) cells.push(`M${x} ${y}h1v1h-1z`)
    }
  }
  return cells.join('')
})()

const QrFinder = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="0.5" y="0.5" width="6" height="6" fill="none" stroke="#0b1f4b" strokeWidth="1" />
    <rect x="2" y="2" width="3" height="3" fill="#0b1f4b" />
  </g>
)

/** A rating question on the form: a label bar and `filled` of five dots. */
const Rating = ({ y, filled }: { y: number; filled: number }) => (
  <g>
    <rect x="14" y={y} width={filled === 5 ? 92 : 76} height="4" rx="2" fill="#fff" fillOpacity="0.55" />
    {Array.from({ length: 5 }, (_, i) =>
      i < filled ? (
        <circle key={i} cx={20 + i * 15} cy={y + 15} r="4.5" fill="#f5862e" />
      ) : (
        <circle key={i} cx={20 + i * 15} cy={y + 15} r="4" fill="none" stroke="#fff" strokeOpacity="0.45" />
      ),
    )}
  </g>
)

const FONT = 'Raleway, sans-serif'

export default function CertificateArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 440 300" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="ca-name" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1197e8" />
          <stop offset="1" stopColor="#0a62c4" />
        </linearGradient>
        <linearGradient id="ca-ribbon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffb300" />
          <stop offset="1" stopColor="#f57c00" />
        </linearGradient>
        <linearGradient id="ca-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd25a" />
          <stop offset="1" stopColor="#e8900f" />
        </linearGradient>
        <linearGradient id="ca-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e8f2fc" />
        </linearGradient>
        <filter id="ca-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#020b24" floodOpacity="0.5" />
        </filter>
        <filter id="ca-ground" x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Contact shadow: both sheets rest on the same surface. */}
      <ellipse cx="236" cy="280" rx="176" ry="9" fill="#020b24" opacity="0.45" filter="url(#ca-ground)" />

      {/* 1 · The feedback form (glass, behind). */}
      <g transform="translate(14 62) rotate(-6)">
        <rect width="156" height="200" rx="12" fill="#fff" fillOpacity="0.1" stroke="#fff" strokeOpacity="0.28" />
        <circle cx="20" cy="20" r="5" fill="#00a9e8" />
        <text x="31" y="23.5" fontSize="10" fontWeight="800" fill="#fff" fontFamily={FONT}>
          Feedback
        </text>
        <rect x="14" y="34" width="128" height="3" rx="1.5" fill="#3aaa35" />
        <Rating y={50} filled={5} />
        <Rating y={80} filled={4} />
        <Rating y={110} filled={5} />
        <rect x="14" y="140" width="128" height="20" rx="4" fill="none" stroke="#fff" strokeOpacity="0.3" />
        <rect x="20" y="147" width="70" height="3" rx="1.5" fill="#fff" fillOpacity="0.35" />
        <rect x="14" y="170" width="128" height="18" rx="9" fill="#00a9e8" />
        <text x="78" y="182" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#fff" fontFamily={FONT}>
          Submit
        </text>
      </g>

      {/* 2 · The certificate it issues (front). */}
      <g transform="translate(150 40) rotate(3)" filter="url(#ca-shadow)">
        <rect width="272" height="192" rx="10" fill="url(#ca-paper)" />
        <rect x="8" y="8" width="256" height="176" rx="6" fill="none" stroke="#2a9be0" strokeWidth="1.6" />
        <rect x="12" y="12" width="248" height="168" rx="4" fill="none" stroke="#8fc2ee" strokeWidth="0.6" />

        <g fontFamily={FONT} textAnchor="middle">
          <text x="136" y="40" fontSize="6.5" fontWeight="700" letterSpacing="1.6" fill="#33456b">
            THIS IS TO CERTIFY THAT
          </text>
          <text x="136" y="66" fontSize="21" fontWeight="800" fontStyle="italic" fill="url(#ca-name)">
            Your Name
          </text>
          <rect x="76" y="73" width="120" height="0.8" fill="#8fc2ee" />
          <text x="136" y="86" fontSize="6.2" fontWeight="500" fill="#33456b">
            has successfully completed the
          </text>

          <path d="M68 94 h136 l-6 9 l6 9 h-136 l6 -9 z" fill="url(#ca-ribbon)" />
          <text x="136" y="106.5" fontSize="9" fontWeight="800" fontStyle="italic" fill="#fff">
            StableNet® Training
          </text>
          <rect x="92" y="121" width="88" height="3" rx="1.5" fill="#c9dcf3" />
          <rect x="108" y="128" width="56" height="3" rx="1.5" fill="#c9dcf3" />

          <path
            d="M30 152 c6 -12 12 -14 13 -4 s6 -10 11 -3 s7 2 14 -4 s6 4 10 1"
            fill="none"
            stroke="#0b1f4b"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <rect x="26" y="158" width="62" height="0.8" fill="#0b1f4b" />
          <text x="57" y="167" fontSize="5.5" fontWeight="800" fill="#0b1f4b">
            Trainer
          </text>
          <rect x="108" y="150" width="56" height="4" rx="2" fill="#0b1f4b" fillOpacity="0.75" />
          <rect x="106" y="158" width="60" height="0.8" fill="#0b1f4b" />
          <text x="136" y="167" fontSize="5.5" fontWeight="800" fill="#0b1f4b">
            Date
          </text>
          <text x="221.5" y="171" fontSize="4.6" fontWeight="700" fill="#33456b">
            Scan to verify
          </text>
        </g>

        {/* Scan-to-verify QR. */}
        <g transform="translate(206 130) scale(1.48)">
          <rect x="-1" y="-1" width={QR_SIZE + 2} height={QR_SIZE + 2} fill="#fff" />
          <path d={QR_CELLS} fill="#0b1f4b" />
          <QrFinder x={0} y={0} />
          <QrFinder x={QR_SIZE - 7} y={0} />
          <QrFinder x={0} y={QR_SIZE - 7} />
        </g>

        {/* Gold seal on the top-right corner. */}
        <polygon points="226,52 218,80 228,74 235,83 240,54" fill="#0a5cc2" />
        <polygon points="244,54 249,83 256,74 266,80 258,52" fill="#1677d6" />
        <polygon points={sealEdge(242, 38, 22, 19)} fill="url(#ca-gold)" />
        <circle cx="242" cy="38" r="15" fill="none" stroke="#fff4cf" strokeWidth="1" />
        <path d="M235 38.5 l5 5 l9 -10" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Verification chip pinned to the certificate. */}
      <g transform="translate(176 228)">
        <rect width="132" height="24" rx="12" fill="#0b2a5b" stroke="#3aaa35" strokeOpacity="0.7" />
        <circle cx="13" cy="12" r="7" fill="#3aaa35" />
        <path d="M9.6 12.2 l2.4 2.4 l4.4 -5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="26" y="15.5" fontSize="9" fontWeight="700" fill="#fff" fontFamily={FONT}>
          Approved · verified PDF
        </text>
      </g>
    </svg>
  )
}
