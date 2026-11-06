import { CheckCircleFilled, EyeOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Badge, Button, Card, Flex, Segmented, Space, Tag, Typography } from 'antd'
import { useState } from 'react'
import CertificateViewer from '@/components/certificate/CertificateViewer'
import { CERTIFICATE_DESIGNS } from '@/config/constants'
import type { CertificateDesign, CertificateRecord, CertificateSettings } from '@/types'

interface CertificatePreviewCardProps {
  settings: CertificateSettings
  selectedDesign: CertificateDesign
  onSelectDesign: (design: CertificateDesign) => void
}

const SAMPLE_RECORD: CertificateRecord = {
  name: 'Participant Name',
  opco: 'MTN Cameroon',
  certId: 'ZC-STN-261105-VZPY',
  submittedAt: new Date().toISOString(),
  verificationCode: 'C7AA-811B-97BO',
}

export default function CertificatePreviewCard({
  settings,
  selectedDesign,
  onSelectDesign,
}: CertificatePreviewCardProps) {
  const [previewDesign, setPreviewDesign] = useState<CertificateDesign>(selectedDesign)

  const isCurrentActive = selectedDesign === previewDesign

  const activeMeta = CERTIFICATE_DESIGNS.find((d) => d.id === previewDesign) ?? CERTIFICATE_DESIGNS[0]

  return (
    <Card
      className="mt-6 overflow-hidden border border-slate-200 dark:border-slate-800"
      styles={{ body: { padding: '20px 24px' } }}
    >
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <Flex align="center" gap={8}>
            <EyeOutlined className="text-brand text-lg" />
            <Typography.Title level={5} className="my-0!">
              Live Certificate Design Preview
            </Typography.Title>
            {isCurrentActive ? (
              <Tag color="success" icon={<CheckCircleFilled />}>
                Active Design
              </Tag>
            ) : (
              <Tag color="default">Previewing Alternate</Tag>
            )}
          </Flex>
          <Typography.Text type="secondary" className="text-xs">
            Review both certificate variants with live sample data, training dates, and trainer signature.
          </Typography.Text>
        </div>

        <Flex gap={8} align="center">
          <Segmented<CertificateDesign>
            value={previewDesign}
            onChange={(val) => setPreviewDesign(val as CertificateDesign)}
            options={[
              {
                value: 'classic',
                label: (
                  <span className="flex items-center gap-1.5 px-1 py-0.5">
                    <SafetyCertificateOutlined />
                    <span>Minimalist Certificate</span>
                  </span>
                ),
              },
              {
                value: 'modern',
                label: (
                  <span className="flex items-center gap-1.5 px-1 py-0.5">
                    <ThunderboltOutlined />
                    <span>Styled Certificate</span>
                  </span>
                ),
              },
            ]}
          />
        </Flex>
      </div>

      <div className="mb-4 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-900/60">
        <Flex justify="space-between" align="center" wrap gap={8}>
          <div>
            <Typography.Text strong className="mr-2">
              {activeMeta.name}
            </Typography.Text>
            <Typography.Text type="secondary" className="text-xs">
              {activeMeta.description}
            </Typography.Text>
          </div>

          {!isCurrentActive && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleFilled />}
              onClick={() => onSelectDesign(previewDesign)}
            >
              Set as Active Certificate Design
            </Button>
          )}
        </Flex>
      </div>

      <div className="w-full">
        <CertificateViewer
          record={SAMPLE_RECORD}
          settings={settings}
          designOverride={previewDesign}
          actions={
            !isCurrentActive ? (
              <Button type="default" onClick={() => onSelectDesign(previewDesign)}>
                Set as Active Design
              </Button>
            ) : undefined
          }
        />
      </div>
    </Card>
  )
}
