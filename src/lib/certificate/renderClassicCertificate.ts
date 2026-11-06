import { LOGOS } from '@/config/constants'
import { verificationUrl } from '@/config/routes'
import type { CertificateRecord, CertificateSettings } from '@/types'
import { formatLongDate } from '@/utils/date'
import { loadImage } from '@/utils/image'
import { CERT_FONTS } from './constants'
import { ensureCertificateFonts } from './fonts'
import { renderQrCanvas } from './qr'

const RF = CERT_FONTS.sans
const SF = CERT_FONTS.script

/** Largest font size (stepping down) at which text fits maxWidth in ctx */
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  weight: string,
  size: number,
  family: string,
  maxWidth: number,
): number {
  let s = size
  while (s > 20) {
    ctx.font = `${weight} ${s}px ${family}`
    if (ctx.measureText(text).width <= maxWidth) break
    s -= 2
  }
  return s
}

/**
 * Render the official Classic Security Certificate design (matching the PDF format).
 * Includes security guilloche rosettes, wave patterns, diagonal watermark,
 * outer microtext ribbon borders, Zoracom motif, QR code top-right, and clean corporate layout.
 */
export async function renderClassicCertificate(
  canvas: HTMLCanvasElement,
  record: CertificateRecord,
  settings: CertificateSettings,
): Promise<void> {
  const code = record.verificationCode
  const [, qr, logo, stablenet, signature, mark] = await Promise.all([
    ensureCertificateFonts(),
    renderQrCanvas(verificationUrl(code), 220),
    loadImage(LOGOS.zoracom.src),
    loadImage(LOGOS.stablenet.src),
    loadImage(settings.signature),
    loadImage(LOGOS.mark.src),
  ])

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  const W = canvas.width
  const H = canvas.height
  const cx = W / 2

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, W, H)

  // 1. Zoracom X motif watermark (thick diagonal orange & sky strokes)
  ctx.save()
  ctx.globalAlpha = 0.07
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#F26A21'
  ctx.lineWidth = 170
  ctx.beginPath()
  ctx.moveTo(W - 760, 330)
  ctx.lineTo(W - 240, 1100)
  ctx.stroke()
  ctx.strokeStyle = '#00A9E8'
  ctx.lineWidth = 120
  ctx.beginPath()
  ctx.moveTo(W - 240, 330)
  ctx.lineTo(W - 760, 1100)
  ctx.stroke()
  ctx.restore()

  // 2. Security: repeated diagonal watermark text ("ZORACOM") across entire surface
  ctx.save()
  ctx.globalAlpha = 0.035
  ctx.fillStyle = '#0B2A5B'
  ctx.font = '800 46px ' + RF
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.translate(W / 2, H / 2)
  ctx.rotate(-Math.PI / 9)
  for (let yy = -H; yy < H; yy += 120) {
    const off = Math.round(yy / 120) % 2 ? 210 : 0
    for (let xx = -W; xx < W; xx += 420) {
      ctx.fillText('ZORACOM', xx + off, yy)
    }
  }
  ctx.restore()

  // 3. Security: guilloche rosette behind recipient name
  ctx.save()
  ctx.globalAlpha = 0.09
  ctx.strokeStyle = '#00A9E8'
  ctx.lineWidth = 1.6
  for (let k = 0; k < 36; k++) {
    ctx.beginPath()
    ctx.ellipse(cx, 830, 560, 170, (k * Math.PI) / 36, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()

  // RA logo (the middle of the full Zoracom logo) inside the circle formed by the spirals
  if (mark) {
    ctx.save()
    ctx.globalAlpha = 0.16 // soft opacity so it doesn't interfere with the text
    const markH = 150
    const markW = (mark.width * markH) / mark.height
    ctx.drawImage(mark, cx - markW / 2, 830 - markH / 2, markW, markH)
    ctx.restore()
  }

  // 4. Security: guilloche wave band at the top
  ctx.save()
  ctx.globalAlpha = 0.28
  ctx.strokeStyle = '#0072CE'
  ctx.lineWidth = 1.5
  for (let k = 0; k < 8; k++) {
    ctx.beginPath()
    for (let gx = 140; gx <= W - 140; gx += 5) {
      const gy = 140 + 18 * Math.sin(gx / 38 + k * 0.8) * Math.sin(gx / 310 + k * 0.2)
      if (gx === 140) ctx.moveTo(gx, gy)
      else ctx.lineTo(gx, gy)
    }
    ctx.stroke()
  }
  ctx.restore()

  // 5. Outer Frame: Dark navy solid border
  ctx.strokeStyle = '#0B2A5B'
  ctx.lineWidth = 26
  ctx.strokeRect(46, 46, W - 92, H - 92)

  // 6. Security: microtext ribbon between borders
  const microtext = (mx: number, my: number, len: number, ang: number) => {
    ctx.save()
    ctx.translate(mx, my)
    ctx.rotate(ang)
    ctx.font = '600 13px ' + RF
    ctx.fillStyle = '#0B2A5B'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const unit = 'ZORACOM STABLENET CERTIFIED TRAINING  '
    let s = ''
    while (ctx.measureText(s).width < len) s += unit
    ctx.beginPath()
    ctx.rect(0, -10, len, 20)
    ctx.clip()
    ctx.fillText(s, 0, 0)
    ctx.restore()
  }
  microtext(75, 75, W - 150, 0)
  microtext(75, H - 75, W - 150, 0)
  microtext(75, 75, H - 150, Math.PI / 2)
  microtext(W - 75, 75, H - 150, Math.PI / 2)

  // 7. Inner cyan accent stroke
  ctx.strokeStyle = '#00A9E8'
  ctx.lineWidth = 4
  ctx.strokeRect(92, 92, W - 184, H - 184)

  // 8. Bottom brand stripe (gradient from dark navy #0B2A5B to leaf green #3AAA35)
  const brandGrad = ctx.createLinearGradient(140, 0, W - 140, 0)
  brandGrad.addColorStop(0, '#0B2A5B')
  brandGrad.addColorStop(1, '#3AAA35')
  ctx.fillStyle = brandGrad
  ctx.fillRect(140, H - 150, W - 280, 12)

  // 9. Zoracom Wordmark / Logo centered at top
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  if (logo) {
    const lh = 64
    const lw = (logo.width * lh) / logo.height
    ctx.drawImage(logo, cx - lw / 2, 205, lw, lh)
  } else {
    ctx.font = '800 78px ' + RF
    let x = 170
    const y = 245
    ;[
      ['Zo', '#3AAA35'],
      ['ra', '#00A9E8'],
      ['com', '#3AAA35'],
    ].forEach(([t, col]) => {
      ctx.fillStyle = col
      ctx.fillText(t, x, y)
      x += ctx.measureText(t).width
    })
  }

  // 10. StableNet logo (bottom centre)
  if (stablenet) {
    const sh = 105
    const sw = (stablenet.width * sh) / stablenet.height
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(cx - sw / 2 - 14, 1292, sw + 28, sh + 16)
    ctx.drawImage(stablenet, cx - sw / 2, 1300, sw, sh)
  }

  // 11. Security QR Code (top right - size reduced and pushed down for breathable space)
  if (qr) {
    const size = 180
    const qx = W - 180 - size
    const qy = 225
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(qx - 10, qy - 10, size + 20, size + 20)
    ctx.drawImage(qr, qx, qy, size, size)
    ctx.fillStyle = '#56677F'
    ctx.font = '600 20px ' + RF
    ctx.textAlign = 'center'
    ctx.fillText('Scan to verify', qx + size / 2, qy + size + 34)
    ctx.textAlign = 'left'
  }

  // 12. Title: "Certificate of Completion"
  ctx.textAlign = 'center'
  ctx.fillStyle = '#0B2A5B'
  ctx.font = '800 114px ' + RF
  ctx.fillText('Certificate of Completion', cx, 440)

  // 13. Orange accent bar under title
  ctx.fillStyle = '#F26A21'
  ctx.fillRect(cx - 90, 478, 180, 8)

  // 14. "This is to certify that" with increased breathable space
  ctx.fillStyle = '#56677F'
  ctx.font = '500 44px ' + RF
  ctx.fillText('This is to certify that', cx, 640)

  // 15. Recipient Name (bright blue)
  const name = record.name
  const ns = fitFont(ctx, name, '700', 112, RF, W - 700)
  ctx.fillStyle = '#0072CE'
  ctx.font = `700 ${ns}px ` + RF
  ctx.fillText(name, cx, 790)

  // Underline below recipient name
  ctx.strokeStyle = '#D3DDEA'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(cx - 640, 840)
  ctx.lineTo(cx + 640, 840)
  ctx.stroke()

  // 16. OpCo line
  ctx.fillStyle = '#13233F'
  ctx.font = '500 46px ' + RF
  ctx.fillText(`of ${record.opco} has successfully completed the`, cx, 940)

  // 17. Course title
  ctx.font = '800 58px ' + RF
  ctx.fillStyle = '#0B2A5B'
  ctx.fillText('5-Day StableNet Training', cx, 1030)

  // 18. Scope / Dates line
  ctx.font = '500 44px ' + RF
  ctx.fillStyle = '#13233F'
  const dates =
    settings.startDate && settings.endDate
      ? `${formatLongDate(settings.startDate)} – ${formatLongDate(settings.endDate)}`
      : settings.startDate
        ? formatLongDate(settings.startDate)
        : settings.endDate
          ? formatLongDate(settings.endDate)
          : settings.legacyDates ?? ''
  const dateLine = dates
    ? `on the use and application of StableNet (Basic & Advanced), held ${dates}.`
    : 'on the use and application of StableNet (Basic & Advanced).'
  fitFont(ctx, dateLine, '500', 44, RF, W - 500)
  ctx.fillText(dateLine, cx, 1105)

  // 19. Signature block (bottom left)
  const sx = 560
  const lineY = 1385
  if (signature) {
    const maxW = 560
    const maxH = 190
    const r = Math.min(maxW / signature.width, maxH / signature.height)
    const w = signature.width * r
    const h = signature.height * r
    ctx.drawImage(signature, sx - w / 2, lineY - h - 10, w, h)
  } else if (settings.trainerName) {
    ctx.fillStyle = '#0B2A5B'
    const sigSize = fitFont(ctx, settings.trainerName, '400', 110, SF, 600)
    ctx.font = `400 ${sigSize}px ` + SF
    ctx.fillText(settings.trainerName, sx, lineY - 30)
  }

  ctx.strokeStyle = '#13233F'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(sx - 320, lineY)
  ctx.lineTo(sx + 320, lineY)
  ctx.stroke()

  ctx.fillStyle = '#13233F'
  ctx.font = '700 40px ' + RF
  ctx.fillText(settings.trainerName || 'StableNet Trainer', sx, lineY + 58)

  ctx.fillStyle = '#56677F'
  ctx.font = '500 32px ' + RF
  ctx.fillText('StableNet Certified Train the Trainer (TTT)', sx, lineY + 105)
  ctx.fillText('Zora Communications Ltd', sx, lineY + 148)

  // 20. Issue details block (bottom right)
  const dx = W - 560
  ctx.fillStyle = '#13233F'
  ctx.font = '700 40px ' + RF
  ctx.fillText(formatLongDate(record.submittedAt), dx, lineY - 30)

  ctx.strokeStyle = '#13233F'
  ctx.beginPath()
  ctx.moveTo(dx - 280, lineY)
  ctx.lineTo(dx + 280, lineY)
  ctx.stroke()

  ctx.fillStyle = '#56677F'
  ctx.font = '500 32px ' + RF
  ctx.fillText('Date of issue', dx, lineY + 58)
  ctx.fillText(`Certificate ID: ${record.certId}`, dx, lineY + 105)
  ctx.fillText(`Verification code: ${record.verificationCode}`, dx, lineY + 148)
}
