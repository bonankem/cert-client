import { useCallback, useEffect, useRef, useState } from 'react'
import { createCertificateCanvas, renderCertificate } from '@/lib/certificate'
import type { CertificateDesign, CertificateRecord, CertificateSettings } from '@/types'

interface RenderResult {
  record: CertificateRecord | null
  settings: CertificateSettings | null
  design: CertificateDesign | undefined
  url: string | null
  error: boolean
}

const EMPTY: RenderResult = { record: null, settings: null, design: undefined, url: null, error: false }

/**
 * Render a certificate for `record` and expose it as a PNG data URL.
 * Pass `record = null` to skip rendering (e.g. while a modal is closed);
 * the last image is kept so a closing modal doesn't flash empty.
 */
export function useCertificateImage(
  record: CertificateRecord | null,
  settings: CertificateSettings,
  designOverride?: CertificateDesign,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [result, setResult] = useState<RenderResult>(EMPTY)

  useEffect(() => {
    if (!record) return undefined
    const job = { active: true }
    const canvas = createCertificateCanvas()

    renderCertificate(canvas, record, settings, designOverride)
      .then(() => {
        if (!job.active) return
        canvasRef.current = canvas
        setResult({ record, settings, design: designOverride, url: canvas.toDataURL('image/png'), error: false })
      })
      .catch((error: unknown) => {
        if (job.active) {
          console.error('Unable to render certificate', error)
          setResult({ record, settings, design: designOverride, url: null, error: true })
        }
      })

    return () => {
      job.active = false
    }
  }, [record, settings, designOverride])

  const getCanvas = useCallback(() => canvasRef.current, [])

  const isCurrent =
    !record || (result.record === record && result.settings === settings && result.design === designOverride)

  return {
    url: isCurrent ? result.url : null,
    error: isCurrent && result.error,
    loading: !isCurrent,
    getCanvas,
  }
}
