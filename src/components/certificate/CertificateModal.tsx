import { Alert, Button, Modal, Typography } from 'antd'
import type { CertificateDialog } from '@/hooks/useCertificateDialog'
import { useCertificateSettings } from '@/hooks/queries/public'
import type { CertificateRecord, CertificateVariant, DownloadSource } from '@/types'
import { firstName } from '@/utils/text'
import CertificateViewer from './CertificateViewer'

interface VariantConfig {
  title: (record: CertificateRecord) => string
  text: string
  trackAs?: DownloadSource
}

const VARIANTS: Record<CertificateVariant, VariantConfig> = {
  submitted: {
    title: (r) => `Thank you, ${firstName(r.name)}!`,
    text: 'Your feedback has been submitted. Here’s your certificate.',
    trackAs: 'participant',
  },
  returning: {
    title: () => 'Your certificate',
    text: 'Here’s the certificate you received.',
    trackAs: 'participant',
  },
  admin: {
    title: (r) => r.name,
    text: 'Certificate as issued to this participant.',
    trackAs: 'admin',
  },
}

export default function CertificateModal({ dialog }: { dialog: CertificateDialog }) {
  const { open, record, variant, note, close } = dialog
  const { settings: savedSettings } = useCertificateSettings()

  if (!record) return null
  const config = VARIANTS[variant]

  return (
    <Modal
      open={open}
      onCancel={close}
      title={<span className="text-2xl font-extrabold">{config.title(record)}</span>}
      width={680}
      footer={null}
    >
      <Typography.Paragraph type="secondary">{config.text}</Typography.Paragraph>
      {note && <Alert type="warning" showIcon title={note} className="mb-3.5" />}
      <CertificateViewer
        record={open ? record : null}
        settings={dialog.settings ?? savedSettings}
        trackAs={config.trackAs}
        actions={<Button onClick={close}>Close</Button>}
      />
    </Modal>
  )
}
