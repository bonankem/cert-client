import { CheckCircleOutlined, CloseCircleOutlined, StopOutlined } from '@ant-design/icons'
import { Alert, Button, Flex } from 'antd'
import CertificateViewer from '@/components/certificate/CertificateViewer'
import type { CertificateSettings, ResponseDetail, ResponseSummary } from '@/types'
import { useReviewActions } from '../hooks/useReviewActions'

/** Approve / don't approve / revoke buttons for one response. */
export function ReviewButtons({ response }: { response: ResponseSummary }) {
  const { approve, reject, approving } = useReviewActions()

  if (response.status === 'approved') {
    return (
      <Button size="small" danger icon={<StopOutlined />} onClick={() => reject(response)}>
        Revoke
      </Button>
    )
  }
  return (
    <Flex gap={8} wrap>
      <Button size="small" type="primary" icon={<CheckCircleOutlined />} loading={approving} onClick={() => approve([response])}>
        Approve
      </Button>
      {response.status === 'pending' && (
        <Button size="small" danger icon={<CloseCircleOutlined />} onClick={() => reject(response)}>
          Reject
        </Button>
      )}
    </Flex>
  )
}

/** The certificate once approved; otherwise a prompt to review the response first. */
export function CertificatePanel({ response, settings }: { response: ResponseDetail; settings: CertificateSettings }) {
  if (response.status === 'approved') {
    return <CertificateViewer record={response} settings={settings} trackAs="admin" />
  }
  return (
    <Alert
      type={response.status === 'pending' ? 'warning' : 'error'}
      showIcon
      title={response.status === 'pending' ? 'Awaiting approval' : 'Rejected'}
      description={
        response.status === 'pending'
          ? 'Approve this response to issue the certificate. The participant is emailed a download link.'
          : `This certificate was not issued${response.rejectionReason ? ` (${response.rejectionReason})` : ''}. Approve it to issue it after all.`
      }
      action={<ReviewButtons response={response} />}
    />
  )
}
