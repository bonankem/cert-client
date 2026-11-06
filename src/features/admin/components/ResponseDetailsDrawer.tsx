import { Alert, Descriptions, Drawer, Skeleton, Tabs, Typography } from 'antd'
import CertificateViewer from '@/components/certificate/CertificateViewer'
import { errorMessage } from '@/api'
import { useResponse } from '@/hooks/queries/admin'
import { useCertificateSettings, useFormConfig } from '@/hooks/queries/public'
import type { ResponseSummary } from '@/types'
import AnswersCard from './AnswersCard'
import DownloadHistoryCard from './DownloadHistoryCard'
import ParticipantCard from './ParticipantCard'

interface ResponseDetailsDrawerProps {
  certId: string | null
  open: boolean
  onClose: () => void
  summary?: ResponseSummary
}

export default function ResponseDetailsDrawer({ certId, open, onClose, summary }: ResponseDetailsDrawerProps) {
  const response = useResponse(open ? certId ?? undefined : undefined)
  const config = useFormConfig()
  const { settings } = useCertificateSettings()
  const detail = response.data

  return (
    <Drawer
      title={
        <div className="min-w-0">
          <Typography.Text strong className="block truncate text-lg">
            {detail?.name ?? summary?.name ?? 'Participant details'}
          </Typography.Text>
          <Typography.Text type="secondary" className="text-sm">
            {detail?.certId ?? summary?.certId ?? ''}
          </Typography.Text>
        </div>
      }
      placement="right"
      size="large"
      styles={{ wrapper: { maxWidth: '920px', width: '100%' } }}
      open={open}
      onClose={onClose}
      destroyOnHidden
    >
      {response.isPending || (detail && config.isPending) ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : response.isError ? (
        <Alert type="error" showIcon message="Participant details couldn’t be loaded" description={errorMessage(response.error)} />
      ) : config.isError ? (
        <Alert type="error" showIcon message="Feedback form details couldn’t be loaded" description={errorMessage(config.error)} />
      ) : detail && config.data ? (
        <Tabs
          items={[
            {
              key: 'participant',
              label: 'Participant & certificate',
              children: (
                <div className="flex flex-col gap-4">
                  <ParticipantCard response={detail} />
                  <CertificateViewer record={detail} settings={settings} trackAs="admin" />
                  <DownloadHistoryCard downloads={detail.downloads} />
                </div>
              ),
            },
            {
              key: 'feedback',
              label: 'Feedback response',
              children: (
                <div className="flex flex-col gap-4">
                  <Descriptions
                    bordered
                    size="small"
                    column={{ xs: 1, sm: 2 }}
                    items={[
                      { key: 'name', label: 'Participant', children: detail.name },
                      { key: 'opco', label: 'OpCo', children: detail.opco },
                      { key: 'submitted', label: 'Submitted', children: detail.submittedAt ? new Date(detail.submittedAt).toLocaleString('en-GB') : '—' },
                    ]}
                  />
                  <AnswersCard answers={detail.answers} config={config.data} />
                </div>
              ),
            },
          ]}
        />
      ) : (
        <Alert type="warning" showIcon message="No participant selected" />
      )}
    </Drawer>
  )
}
