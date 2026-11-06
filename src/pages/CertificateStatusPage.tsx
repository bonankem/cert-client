import { ReloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Result, Skeleton, Typography } from 'antd'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiError, errorMessage } from '@/api'
import CertificateViewer from '@/components/certificate/CertificateViewer'
import PageLayout from '@/components/layout/PageLayout'
import { PendingStatusCard } from '@/features/certificate-status'
import { ROUTES } from '@/config/routes'
import { useCertificateSettings, useSubmissionStatus } from '@/hooks/queries/public'
import { forgetSubmission, rememberSubmission } from '@/services/mySubmission'
import type { SubmissionStatus } from '@/types'
import { formatLongDate } from '@/utils/date'
import { firstName } from '@/utils/text'

/** Banner about the participant's latest update request, shown above an approved certificate. */
function UpdateNotice({ update }: { update: NonNullable<SubmissionStatus['update']> }) {
  if (update.status === 'pending') {
    return (
      <Alert
        type="info"
        showIcon
        className="mb-4"
        title="Your update request is awaiting approval"
        description={`Requested ${formatLongDate(update.requestedAt)}. The certificate below stays valid until the training team reviews your changes. We’ll email you when they do.`}
      />
    )
  }
  if (update.status === 'rejected' && update.rejectionReason !== 'Certificate revoked') {
    return (
      <Alert
        type="warning"
        showIcon
        closable
        className="mb-4"
        title="Your latest update request was rejected"
        description={
          update.rejectionReason
            ? `Reason: ${update.rejectionReason}. Your certificate below is unchanged.`
            : 'Your certificate below is unchanged.'
        }
      />
    )
  }
  return null
}

function Approved({ status }: { status: SubmissionStatus }) {
  const { settings } = useCertificateSettings()
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <SafetyCertificateOutlined className="text-[#3aaa35]" />
          Your certificate is ready, {firstName(status.name)}
        </span>
      }
    >
      {status.update && <UpdateNotice update={status.update} />}
      <CertificateViewer record={status.certificate} settings={settings} trackAs="participant" />
    </Card>
  )
}

function Rejected({ status }: { status: SubmissionStatus }) {
  const navigate = useNavigate()
  const resubmit = () => {
    forgetSubmission()
    navigate(ROUTES.feedback)
  }
  return (
    <Card>
      <Result
        status="warning"
        title="Your certificate was rejected"
        subTitle={
          status.rejectionReason ? (
            <>
              Reason: <strong>{status.rejectionReason}</strong>
            </>
          ) : (
            'The training team could not approve this submission.'
          )
        }
        extra={
          <>
            <Typography.Paragraph type="secondary">
              If this was a mistake, for example a misspelled name, you can submit the form again.
            </Typography.Paragraph>
            <Button type="primary" icon={<ReloadOutlined />} onClick={resubmit}>
              Submit the form again
            </Button>
          </>
        }
      />
    </Card>
  )
}

export default function CertificateStatusPage() {
  const { token } = useParams<{ token: string }>()
  const query = useSubmissionStatus(token)
  const navigate = useNavigate()
  const status = query.data

  // Remember the link on this device too (e.g. opened from the email on another phone).
  useEffect(() => {
    if (status) rememberSubmission(status)
  }, [status])

  let body
  if (query.isPending) {
    body = (
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    )
  } else if (query.isError) {
    const notFound = query.error instanceof ApiError && query.error.status === 404
    body = (
      <Card>
        <Result
          status={notFound ? '404' : 'warning'}
          title={notFound ? 'We couldn’t find this submission' : 'Couldn’t load your certificate status'}
          subTitle={notFound ? 'Check that you opened the full link from your email.' : errorMessage(query.error)}
          extra={
            notFound ? (
              <Button onClick={() => navigate(ROUTES.feedback)}>Go to the feedback form</Button>
            ) : (
              <Button onClick={() => query.refetch()}>Try again</Button>
            )
          }
        />
      </Card>
    )
  } else if (status?.status === 'approved' && status.certificate) {
    body = <Approved status={status} />
  } else if (status?.status === 'rejected') {
    body = <Rejected status={status} />
  } else if (status) {
    body = <PendingStatusCard status={status} checkedAt={query.dataUpdatedAt} />
  }

  return (
    <PageLayout
      title="Your StableNet"
      titleAccent="Certificate"
      description="Check the approval status of your training certificate and download it once it’s approved."
    >
      {body}
    </PageLayout>
  )
}
