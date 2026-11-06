import { DEFAULT_SETTINGS, LOGOS } from '@/config/constants'
import { verificationUrl } from '@/config/routes'
import type { CertificateDesign, CertificateRecord, CertificateSettings } from '@/types'
import { loadImage } from '@/utils/image'
import { CANVAS_SIZE, LAYOUT } from './constants'
import {
  drawCourse,
  drawIntroPill,
  drawIssueDetails,
  drawLogos,
  drawNameBanner,
  drawQrCode,
  drawSignatureBlock,
  drawTitle,
} from './drawContent'
import { FRAME_LAYERS } from './drawFrame'
import { ensureCertificateFonts } from './fonts'
import { renderQrCanvas } from './qr'
import { renderClassicCertificate } from './renderClassicCertificate'
import type { Scene } from './types'

export function createCertificateCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_SIZE.width
  canvas.height = CANVAS_SIZE.height
  return canvas
}

/** Draw the modern straight-corner full-bleed certificate design. */
async function renderModernCertificate(
  canvas: HTMLCanvasElement,
  record: CertificateRecord,
  settings: CertificateSettings,
): Promise<void> {
  const code = record.verificationCode
  const [, qr, logo, stablenet, signature] = await Promise.all([
    ensureCertificateFonts(),
    renderQrCanvas(verificationUrl(code), LAYOUT.qr.size),
    loadImage(LOGOS.zoracom.src),
    loadImage(LOGOS.stablenet.src),
    loadImage(settings.signature),
  ])

  if (!logo || !stablenet) throw new Error('Unable to load certificate brand logos')

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  const scene: Scene = { ctx, W: canvas.width, H: canvas.height, cx: canvas.width / 2 }

  FRAME_LAYERS.forEach((draw) => draw(scene))
  drawLogos(scene, { logo, stablenet })
  drawQrCode(scene, qr)
  drawTitle(scene)
  drawIntroPill(scene)
  drawNameBanner(scene, record)
  drawCourse(scene, record, settings)
  drawSignatureBlock(scene, settings, signature)
  drawIssueDetails(scene, record)
}

/**
 * Draw a participant's certificate onto `canvas`.
 * Automatically routes to either the Classic (Official PDF) or Modern (Straight-Corner)
 * design based on the active settings or an explicit design override.
 */
export async function renderCertificate(
  canvas: HTMLCanvasElement,
  record: CertificateRecord,
  settings: CertificateSettings = DEFAULT_SETTINGS,
  designOverride?: CertificateDesign,
): Promise<void> {
  const activeDesign: CertificateDesign = designOverride || settings.designVariant || 'classic'

  if (activeDesign === 'modern') {
    return renderModernCertificate(canvas, record, settings)
  }
  return renderClassicCertificate(canvas, record, settings)
}

export { renderClassicCertificate, renderModernCertificate }
