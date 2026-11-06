import type { CertificateDesign, CertificateRecord, CertificateSettings } from '@/types'
import { toSafeFilename } from '@/utils/text'
import { createCertificateCanvas, renderCertificate } from './renderCertificate'

/** Save an already-rendered certificate canvas as a landscape A4 PDF. */
export async function downloadCertificatePdf(canvas: HTMLCanvasElement, participantName: string): Promise<void> {
  const { jsPDF } = await import('jspdf') // loaded on demand to keep the main bundle small
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, 210)
  pdf.save(`StableNet-Certificate-${toSafeFilename(participantName)}.pdf`)
}

/** Render off-screen and download in one step (used from tables). */
export async function exportCertificatePdf(
  record: CertificateRecord,
  settings: CertificateSettings,
  designOverride?: CertificateDesign,
): Promise<void> {
  const canvas = createCertificateCanvas()
  await renderCertificate(canvas, record, settings, designOverride)
  await downloadCertificatePdf(canvas, record.name)
}
