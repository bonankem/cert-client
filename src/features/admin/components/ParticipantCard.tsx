import { Card, Descriptions, Typography } from 'antd'
import type { ResponseDetail } from '@/types'
import { formatDateTime } from '@/utils/date'
import { ApprovalTag, ConsentTag, DownloadStatusTag } from './StatusTags'

/** Who reviewed the response, and when. */
function reviewText(r: ResponseDetail): string {
  if (!r.reviewedAt) return '—'
  const by = r.autoApproved ? 'automatically (participant list)' : r.reviewedBy ? `by ${r.reviewedBy}` : ''
  return `${formatDateTime(r.reviewedAt)} ${by}`.trim()
}

export default function ParticipantCard({ response }: { response: ResponseDetail }) {
  const approved = response.status === 'approved'
  return (
    <Card title="Participant">
      <Descriptions
        column={1}
        size="small"
        items={[
          { key: 'name', label: 'Name', children: response.name },
          {
            key: 'email',
            label: 'Email',
            children: response.email ? <Typography.Text copyable>{response.email}</Typography.Text> : '—',
          },
          { key: 'opco', label: 'OpCo', children: response.opco },
          { key: 'consent', label: 'Success story', children: <ConsentTag value={response.consent} /> },
          { key: 'submitted', label: 'Submitted', children: formatDateTime(response.submittedAt) },
          {
            key: 'approval',
            label: 'Approval',
            children: <ApprovalTag status={response.status} autoApproved={response.autoApproved} />,
          },
          { key: 'reviewed', label: 'Reviewed', children: reviewText(response) },
          ...(response.status === 'rejected' && response.rejectionReason
            ? [{ key: 'reason', label: 'Reason', children: response.rejectionReason }]
            : []),
          {
            key: 'certId',
            label: 'Certificate ID',
            children: <Typography.Text copyable className="font-mono">{response.certId}</Typography.Text>,
          },
          {
            key: 'code',
            label: 'Verification code',
            children: <Typography.Text copyable className="font-mono">{response.verificationCode}</Typography.Text>,
          },
          ...(approved
            ? [
                {
                  key: 'downloads',
                  label: 'Certificate',
                  children: <DownloadStatusTag count={response.participantDownloads} />,
                },
              ]
            : []),
        ]}
      />
    </Card>
  )
}
