import { DownloadOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Button, Flex, Segmented, Spin, Typography } from 'antd'
import { useState, type ReactNode } from 'react'
import { useCertificateDownload } from '@/hooks/useCertificateDownload'
import { useCertificateImage } from '@/hooks/useCertificateImage'
import type { CertificateDesign, CertificateRecord, CertificateSettings, DownloadSource } from '@/types'

interface CertificateViewerProps {
  /** null skips rendering (e.g. while a parent modal is closed). */
  record: CertificateRecord | null
  settings: CertificateSettings
  /** Who the download is logged against; omit to not log (previews). */
  trackAs?: DownloadSource
  /** Extra buttons shown before the download button. */
  actions?: ReactNode
  /** Specific design to render, overriding the settings */
  designOverride?: CertificateDesign
  /** Show a variant switch toggle above the certificate */
  showDesignToggle?: boolean
  /** Callback when user changes the selected design in the viewer */
  onDesignChange?: (design: CertificateDesign) => void
}

/** Rendered certificate image with a PDF download button and optional variant toggle. */
export default function CertificateViewer({
  record,
  settings,
  trackAs,
  actions,
  designOverride,
  showDesignToggle = false,
  onDesignChange,
}: CertificateViewerProps) {
  const [localDesign, setLocalDesign] = useState<CertificateDesign>(
    designOverride || settings.designVariant || 'classic',
  )

  const activeDesign = designOverride !== undefined ? designOverride : localDesign
  const { url, loading, error, getCanvas } = useCertificateImage(record, settings, activeDesign)
  const { download, pendingId } = useCertificateDownload()

  const handleDesignChange = (val: CertificateDesign) => {
    setLocalDesign(val)
    onDesignChange?.(val)
  }

  const isGlobalActive = settings.designVariant ? settings.designVariant === activeDesign : activeDesign === 'classic'

  return (
    <div>
      {showDesignToggle && (
        <Flex justify="space-between" align="center" wrap gap={8} className="mb-3">
          <Segmented<CertificateDesign>
            value={activeDesign}
            onChange={(val) => handleDesignChange(val as CertificateDesign)}
            options={[
              {
                value: 'classic',
                label: (
                  <span className="flex items-center gap-1.5 px-1 py-0.5">
                    <SafetyCertificateOutlined />
                    <span>Minimalist Certificate</span>
                    {settings.designVariant === 'classic' && (
                      <span className="ml-1 rounded bg-leaf/20 px-1.5 py-0.2 text-[11px] font-bold text-leaf">Active</span>
                    )}
                  </span>
                ),
              },
              {
                value: 'modern',
                label: (
                  <span className="flex items-center gap-1.5 px-1 py-0.5">
                    <ThunderboltOutlined />
                    <span>Styled Certificate</span>
                    {settings.designVariant === 'modern' && (
                      <span className="ml-1 rounded bg-leaf/20 px-1.5 py-0.2 text-[11px] font-bold text-leaf">Active</span>
                    )}
                  </span>
                ),
              },
            ]}
          />
          <Typography.Text type="secondary" className="text-xs">
            {isGlobalActive ? 'Viewing current active template' : 'Previewing alternate template'}
          </Typography.Text>
        </Flex>
      )}

      {/* Straight corners with no rounded edges or outer border; corners fill the container edge-to-edge */}
      <div className="flex aspect-[2400/1697] w-full items-center justify-center overflow-hidden rounded-none border-0 bg-white shadow-sm">
        {url && <img src={url} alt="StableNet training certificate" className="block h-auto w-full" />}
        {loading && <Spin />}
        {error && <Typography.Text type="danger">Couldn’t draw the certificate. Please try again.</Typography.Text>}
      </div>

      <Flex gap={10} wrap justify="flex-end" className="mt-4">
        {actions}
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          disabled={!url || !record}
          loading={!!record && pendingId === record.certId}
          onClick={() => record && download(record, { canvas: getCanvas(), trackAs, designOverride: activeDesign })}
        >
          Download certificate (PDF)
        </Button>
      </Flex>
    </div>
  )
}
