import { RightOutlined } from '@ant-design/icons'
import { Button, Card, Table, type TableColumnsType } from 'antd'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { ConsentTag, DownloadStatusTag } from '@/features/admin'
import type { ConsentValue, ResponseSummary } from '@/types'
import { formatDateTime } from '@/utils/date'

export default function RecentResponses({
  items,
  onSelect,
}: {
  items: ResponseSummary[]
  onSelect: (response: ResponseSummary) => void
}) {
  const columns: TableColumnsType<ResponseSummary> = [
    {
      title: 'Participant',
      dataIndex: 'name',
      render: (name: string, record) => (
        <div className="min-w-0">
          <div className="font-semibold text-xs sm:text-[13px] truncate">{name}</div>
          <div className="text-[11px] opacity-70 truncate sm:hidden">{record.opco}</div>
        </div>
      ),
    },
    {
      title: 'OpCo',
      dataIndex: 'opco',
      responsive: ['sm'],
      width: 140,
      render: (opco: string) => <span className="text-xs">{opco}</span>,
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedAt',
      width: 150,
      responsive: ['md'],
      render: (date: string) => <span className="text-xs opacity-75">{formatDateTime(date)}</span>,
    },
    {
      title: 'Consent',
      dataIndex: 'consent',
      width: 100,
      responsive: ['sm'],
      render: (consent: ConsentValue) => <ConsentTag value={consent} />,
    },
    {
      title: 'Certificate',
      dataIndex: 'participantDownloads',
      width: 120,
      responsive: ['sm'],
      render: (downloads: number) => <DownloadStatusTag count={downloads} />,
    },
    {
      title: '',
      key: 'action',
      width: 44,
      align: 'right',
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          icon={<RightOutlined className="text-[11px] opacity-60" />}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(record)
          }}
          aria-label={`View details for ${record.name}`}
        />
      ),
    },
  ]

  return (
    <Card
      title="Latest responses"
      size="small"
      className="h-full min-w-0"
      extra={<Link to={ROUTES.admin.responses} className="text-xs">View all</Link>}
      classNames={{ body: 'p-0!' }}
    >
      <Table<ResponseSummary>
        size="small"
        columns={columns}
        dataSource={items}
        rowKey="certId"
        pagination={false}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => onSelect(record),
          className: 'cursor-pointer hover:bg-black/3 dark:hover:bg-white/4',
        })}
      />
    </Card>
  )
}
