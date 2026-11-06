/*
 * Text, logos, banners, laurels, signature, issue details and QR code.
 * Each function receives the shared Scene plus the data it needs.
 */
import { COURSE, ORGANISATION, TRAINER } from '@/config/constants'
import type { CertificateRecord, CertificateSettings } from '@/types'
import { formatLongDate } from '@/utils/date'
import {
  along,
  drawText,
  fitFontSize,
  hexagonPoints,
  polygonPath,
  scaleToFit,
  scaleToHeight,
  strokeLine,
  withContext,
} from './canvas'
import { CERT_COLORS as C, CERT_FONTS, LAYOUT } from './constants'
import type { Point, Scene, TextStyle } from './types'

type Img = HTMLImageElement | HTMLCanvasElement

const CAPTION: TextStyle = { weight: 500, size: 32, color: C.muted }
const CAPTION_GAP = 46

const trainerLabel = (settings: CertificateSettings) => settings.trainerName || TRAINER.defaultName

function drawCaptions(ctx: CanvasRenderingContext2D, x: number, startY: number, lines: string[]) {
  lines.forEach((line, i) => drawText(ctx, line, x, startY + i * CAPTION_GAP, CAPTION))
}

// ---- logos & QR ---------------------------------------------------------------

export function drawLogos({ ctx, cx }: Scene, { logo, stablenet }: { logo: Img | null; stablenet: Img | null }): void {
  if (logo) {
    const { width, height } = scaleToHeight(logo, LAYOUT.logo.height)
    ctx.drawImage(logo, cx - width / 2, LAYOUT.logo.y, width, height)
  }
  if (stablenet) {
    const { width, height } = scaleToHeight(stablenet, LAYOUT.stablenet.height)
    ctx.drawImage(stablenet, cx - width / 2, LAYOUT.stablenet.y, width, height)
  }
}

/** QR code (rendered by antd's <QRCode>) linking to the public verification page. */
export function drawQrCode({ ctx, W, cx }: Scene, qr: HTMLCanvasElement): void {
  const { size, right, top } = LAYOUT.qr
  const left = right === 0 ? cx - size / 2 : W - right - size
  withContext(ctx, () => {
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(11, 31, 75, 0.16)'
    ctx.shadowBlur = 14
    ctx.shadowOffsetY = 5
    ctx.beginPath()
    ctx.roundRect(left - 10, top - 10, size + 20, size + 20, 10)
    ctx.fill()
  })
  ctx.drawImage(qr, left, top, size, size)
  drawText(ctx, 'Scan to verify', left + size / 2, top + size + 34, { weight: 600, size: 20, color: C.muted })
}

// ---- title ------------------------------------------------------------------

/** Currently unused (kept for an alternative title style). One laurel branch; `side` -1 = left (opens right), 1 = right (mirrored). */
export function drawLaurel(ctx: CanvasRenderingContext2D, x: number, y: number, side: -1 | 1, height: number): void {
  const r = height / 2
  withContext(ctx, () => {
    ctx.translate(x, y)
    if (side === 1) ctx.scale(-1, 1)
    const gold = ctx.createLinearGradient(0, -r, 0, r)
    gold.addColorStop(0, C.gold[0])
    gold.addColorStop(1, C.gold[1])
    ctx.fillStyle = gold
    ctx.strokeStyle = gold

    // stem: an arc bowing outward (to the left before mirroring)
    const centreX = r * 0.75
    const from = (125 * Math.PI) / 180
    const to = (235 * Math.PI) / 180
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(centreX, 0, r, from, to)
    ctx.stroke()

    // leaves along the stem: outer and inner, angled toward the tip
    const leaves = 7
    for (let k = 0; k < leaves; k++) {
      const theta = from + ((to - from) * (k + 0.5)) / leaves
      const px = centreX + r * Math.cos(theta)
      const py = r * Math.sin(theta)
      const nx = Math.cos(theta)
      const ny = Math.sin(theta)
      const tangent = theta + Math.PI / 2
      const scale = 0.75 + (0.35 * (leaves - k)) / leaves
      ctx.beginPath()
      ctx.ellipse(px + nx * 20, py + ny * 20, 26 * scale, 10 * scale, tangent + 0.55, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(px - nx * 14, py - ny * 14, 20 * scale, 8 * scale, tangent - 0.55, 0, Math.PI * 2)
      ctx.fill()
    }
    // tip leaf
    const tipX = centreX + r * Math.cos(to)
    const tipY = r * Math.sin(to)
    ctx.beginPath()
    ctx.ellipse(tipX + 10, tipY - 14, 22, 9, -0.9, 0, Math.PI * 2)
    ctx.fill()
  })
}

export function drawTitle({ ctx, cx }: Scene): void {
  const { y, size, maxWidth } = LAYOUT.title
  const text = 'CERTIFICATE OF COMPLETION'
  const fitted = fitFontSize(ctx, text, { weight: 800, size, maxWidth, italic: true })
  drawText(ctx, text, cx, y, { weight: 800, size: fitted, italic: true, color: C.ink })

  // dash + dot accent under the title (clean and modern, no golden leaf)
  ctx.fillStyle = C.accent
  ctx.beginPath()
  ctx.roundRect(cx - 78, LAYOUT.dashesY, 100, 12, 6)
  ctx.roundRect(cx + 36, LAYOUT.dashesY, 42, 12, 6)
  ctx.fill()
}

// ---- recipient ------------------------------------------------------------------

export function drawIntroPill({ ctx, cx }: Scene): void {
  const { cy, width, height } = LAYOUT.intro
  withContext(ctx, () => {
    polygonPath(ctx, hexagonPoints(cx, cy, width, height, height / 2))
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fill()
    ctx.strokeStyle = C.frameInner
    ctx.lineWidth = 3
    ctx.stroke()
  })
  drawText(ctx, 'THIS IS TO CERTIFY THAT', cx + 7, cy + 12, {
    weight: 700,
    size: 34,
    color: C.ink,
    letterSpacing: '14px',
  })
}

export function drawNameBanner({ ctx, cx }: Scene, record: CertificateRecord): void {
  const { cy, width, height, tip } = LAYOUT.name
  const points = hexagonPoints(cx, cy, width, height, tip)

  withContext(ctx, () => {
    polygonPath(ctx, points)
    const fill = ctx.createLinearGradient(0, cy - height / 2, 0, cy + height / 2)
    fill.addColorStop(0, '#ffffff')
    fill.addColorStop(1, '#e6f2fd')
    ctx.fillStyle = fill
    ctx.fill()
    ctx.strokeStyle = C.frameInner
    ctx.lineWidth = 3.5
    ctx.stroke()

    // chevron accents parallel to the lower-left and lower-right edges
    ctx.strokeStyle = C.accent
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    const accent = (a: Point, b: Point, dx: number) => {
      const start = along(a, b, 0.35, dx, 16)
      const end = along(a, b, 1.05, dx, 16)
      ctx.beginPath()
      ctx.moveTo(...start)
      ctx.lineTo(...end)
      ctx.stroke()
    }
    accent(points[0], points[5], -18)
    accent(points[3], points[4], 18)
  })

  const size = fitFontSize(ctx, record.name, { weight: 800, size: 118, maxWidth: width - tip * 2 - 80 })
  const ink = ctx.createLinearGradient(cx - width / 2, 0, cx + width / 2, 0)
  ink.addColorStop(0, C.nameFrom)
  ink.addColorStop(1, C.nameTo)
  drawText(ctx, record.name, cx, cy + size * 0.36, { weight: 800, size, color: ink })
}

// ---- course -----------------------------------------------------------------------

/** Line + slash beside the course banner (drawn left; rotated 180° for the right). */
function drawCourseFlourish(ctx: CanvasRenderingContext2D, cx: number): void {
  const { cy, width, height, skew } = LAYOUT.course
  const left = cx - width / 2
  strokeLine(ctx, [left - 250, cy], [left - 70, cy], { color: C.accent, width: 3 })
  withContext(ctx, () => {
    ctx.lineCap = 'round'
    strokeLine(ctx, [left - 46, cy + height / 2 - 14], [left - 46 + skew * 0.7, cy - height / 2 + 14], {
      color: C.accent,
      width: 7,
    })
  })
}

export function drawCourse({ ctx, cx }: Scene, record: CertificateRecord, settings: CertificateSettings): void {
  drawText(ctx, `of ${record.opco} has successfully completed the`, cx, LAYOUT.orgLineY, { weight: 500, size: 46 })

  const { cy, width, height, skew } = LAYOUT.course
  const top = cy - height / 2
  const bottom = cy + height / 2
  withContext(ctx, () => {
    polygonPath(ctx, [
      [cx - width / 2 + skew, top],
      [cx + width / 2, top],
      [cx + width / 2 - skew, bottom],
      [cx - width / 2, bottom],
    ])
    const fill = ctx.createLinearGradient(cx - width / 2, 0, cx + width / 2, 0)
    fill.addColorStop(0, C.accentDark)
    fill.addColorStop(1, C.accent)
    ctx.fillStyle = fill
    ctx.shadowColor = 'rgba(10, 92, 194, 0.35)'
    ctx.shadowBlur = 24
    ctx.shadowOffsetY = 8
    ctx.fill()
  })
  drawCourseFlourish(ctx, cx)
  withContext(ctx, () => {
    ctx.translate(cx * 2, cy * 2)
    ctx.rotate(Math.PI)
    drawCourseFlourish(ctx, cx)
  })

  const label = COURSE.title.toUpperCase()
  const size = fitFontSize(ctx, label, { weight: 800, size: 64, maxWidth: width - 200, italic: true })
  drawText(ctx, label, cx, cy + size * 0.36, { weight: 800, size, italic: true, color: '#ffffff' })

  const dates = settings.startDate && settings.endDate
    ? `${formatLongDate(settings.startDate)} – ${formatLongDate(settings.endDate)}`
    : settings.startDate
      ? formatLongDate(settings.startDate)
      : settings.endDate
        ? formatLongDate(settings.endDate)
        : settings.legacyDates ?? ''
  const scope = `on the use and application of ${COURSE.scope}${dates ? `, held ${dates}` : ''}.`
  const scopeSize = fitFontSize(ctx, scope, { weight: 500, size: 44, maxWidth: 1900 })
  drawText(ctx, scope, cx, LAYOUT.scopeY, { weight: 500, size: scopeSize })
}

// ---- footer blocks -----------------------------------------------------------------

export function drawSignatureBlock({ ctx }: Scene, settings: CertificateSettings, signature: Img | null): void {
  const x = LAYOUT.signatureX
  const lineY = LAYOUT.footerLineY

  if (signature) {
    const { width, height } = scaleToFit(signature, 520, 170)
    ctx.drawImage(signature, x - width / 2, lineY - height - 8, width, height)
  } else if (settings.trainerName) {
    const script = { weight: 400, family: CERT_FONTS.script }
    const size = fitFontSize(ctx, settings.trainerName, { ...script, size: 104, maxWidth: 560 })
    drawText(ctx, settings.trainerName, x, lineY - 26, { ...script, size, color: C.ink })
  }

  strokeLine(ctx, [x - 300, lineY], [x + 300, lineY], { color: C.ink, width: 3 })
  drawText(ctx, trainerLabel(settings), x, lineY + 58, { weight: 800, size: 42, color: C.ink })
  drawCaptions(ctx, x, lineY + 58 + CAPTION_GAP, [TRAINER.title, `${ORGANISATION.legalName}.`])
}

export function drawIssueDetails({ ctx }: Scene, record: CertificateRecord): void {
  const x = LAYOUT.detailsX
  const lineY = LAYOUT.footerLineY

  drawText(ctx, formatLongDate(record.submittedAt), x, lineY - 28, { weight: 800, size: 48, color: C.ink })
  strokeLine(ctx, [x - 315, lineY], [x + 315, lineY], { color: C.ink, width: 3 })
  drawCaptions(ctx, x, lineY + 50, [
    'Date of Issue',
    `Certificate ID:  ${record.certId}`,
    `Verification Code:  ${record.verificationCode}`,
  ])
}
