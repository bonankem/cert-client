import { useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { useCallback, useState } from 'react'
import { adminApi, publicApi } from '@/api'
import { downloadCertificatePdf, exportCertificatePdf } from '@/lib/certificate'
import type { CertificateDesign, CertificateRecord, CertificateSettings, DownloadSource } from '@/types'
import { queryKeys } from './queries/keys'
import { useCertificateSettings } from './queries/public'

export interface DownloadOptions {
  /** Reuse an already-rendered canvas instead of drawing again. */
  canvas?: HTMLCanvasElement | null
  /** Log the download against the certificate; omit for previews. */
  trackAs?: DownloadSource
  settings?: CertificateSettings
  designOverride?: CertificateDesign
}

const LOGGERS: Record<DownloadSource, (certId: string) => Promise<void>> = {
  participant: publicApi.recordDownload,
  admin: adminApi.recordDownload,
}

/** Download a certificate as PDF, log it on the server, and surface errors. */
export function useCertificateDownload() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const { settings: savedSettings } = useCertificateSettings()
  const [pendingId, setPendingId] = useState<string | null>(null)

  const download = useCallback(
    async (record: CertificateRecord, { canvas, trackAs, settings, designOverride }: DownloadOptions = {}) => {
      setPendingId(record.certId)
      try {
        if (canvas) await downloadCertificatePdf(canvas, record.name)
        else await exportCertificatePdf(record, settings ?? savedSettings, designOverride)
      } catch {
        message.error('Couldn’t create the PDF. Right-click the certificate and choose “Save image”.')
        setPendingId(null)
        return
      }
      setPendingId(null)

      if (!trackAs) return
      // Logging is best-effort: the participant already has their file.
      try {
        await LOGGERS[trackAs](record.certId)
        if (trackAs === 'admin') await queryClient.invalidateQueries({ queryKey: queryKeys.admin })
      } catch {
        /* ignore */
      }
    },
    [message, queryClient, savedSettings],
  )

  return { download, pendingId }
}
