import { Card, Empty, Timeline } from 'antd'
import type { DownloadEventView } from '@/types'
import { formatDateTime } from '@/utils/date'

const describe = (event: DownloadEventView) =>
  event.source === 'participant' ? 'Downloaded by the participant' : `Downloaded by ${event.downloadedBy ?? 'an admin'}`

export default function DownloadHistoryCard({ downloads }: { downloads: DownloadEventView[] }) {
  return (
    <Card title="Download history">
      {downloads.length ? (
        <Timeline
          items={downloads.map((event) => ({
            key: event.id,
            color: event.source === 'participant' ? 'green' : 'blue',
            title: formatDateTime(event.downloadedAt),
            content: describe(event),
          }))}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="The certificate hasn’t been downloaded yet." />
      )}
    </Card>
  )
}
