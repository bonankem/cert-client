import { Card, Descriptions, Typography } from 'antd'
import type { ResponseDetail } from '@/types'
import { formatDateTime } from '@/utils/date'
import { ConsentTag, DownloadStatusTag } from './StatusTags'

export default function ParticipantCard({ response }: { response: ResponseDetail }) {
  return (
    <Card title="Participant">
      <Descriptions
        column={1}
        size="small"
        items={[
          { key: 'name', label: 'Name', children: response.name },
          { key: 'opco', label: 'OpCo', children: response.opco },
          { key: 'consent', label: 'Success story', children: <ConsentTag value={response.consent} /> },
          { key: 'submitted', label: 'Submitted', children: formatDateTime(response.submittedAt) },
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
          {
            key: 'downloads',
            label: 'Certificate',
            children: <DownloadStatusTag count={response.participantDownloads} />,
          },
        ]}
      />
    </Card>
  )
}
