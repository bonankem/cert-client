import { DownloadOutlined, MoreOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { App, Button, Dropdown } from 'antd'
import { useState } from 'react'
import { adminApi, errorMessage } from '@/api'
import { queryKeys } from '@/hooks/queries/keys'
import { useCertificateDownload } from '@/hooks/useCertificateDownload'
import type { CertificateDesign, ResponseSummary } from '@/types'

interface CertificateActionsProps {
  record: ResponseSummary
  onView: (record: ResponseSummary) => void
}

/** Related participant and certificate actions grouped in one menu. */
export default function CertificateActions({ record, onView }: CertificateActionsProps) {
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const { download, pendingId } = useCertificateDownload()
  const [fetching, setFetching] = useState(false)

  // List rows don't carry the verification code, so load the detail (cached) first.
  const handleDownload = async (designOverride?: CertificateDesign) => {
    setFetching(true)
    try {
      const detail = await queryClient.fetchQuery({
        queryKey: queryKeys.response(record.certId),
        queryFn: () => adminApi.getResponse(record.certId),
      })
      await download(detail, { trackAs: 'admin', designOverride })
    } catch (error) {
      message.error(errorMessage(error))
    } finally {
      setFetching(false)
    }
  }

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: [
          { key: 'view', label: 'Participant & certificate details' },
          { type: 'divider' },
          {
            key: 'download-active',
            icon: <DownloadOutlined />,
            label: 'Download certificate PDF',
            disabled: fetching || pendingId === record.certId,
          },
          {
            key: 'download-variants',
            label: 'Download specific variant',
            children: [
              {
                key: 'download-classic',
                icon: <SafetyCertificateOutlined />,
                label: 'Minimalist Certificate',
              },
              {
                key: 'download-modern',
                icon: <ThunderboltOutlined />,
                label: 'Styled Certificate',
              },
            ],
          },
        ],
        onClick: ({ key }) => {
          if (key === 'view') onView(record)
          if (key === 'download-active') void handleDownload()
          if (key === 'download-classic') void handleDownload('classic')
          if (key === 'download-modern') void handleDownload('modern')
        },
      }}
    >
      <Button
        type="text"
        icon={<MoreOutlined />}
        aria-label={`Actions for ${record.name}`}
        loading={fetching || pendingId === record.certId}
        onClick={(event) => event.stopPropagation()}
      />
    </Dropdown>
  )
}
