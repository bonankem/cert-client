import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import type { ConsentValue } from '@/types'

export function DownloadStatusTag({ count }: { count: number }) {
  return count > 0 ? (
    <Tag color="success" icon={<CheckCircleOutlined />}>
      Downloaded{count > 1 ? ` ×${count}` : ''}
    </Tag>
  ) : (
    <Tag icon={<ClockCircleOutlined />}>Not downloaded</Tag>
  )
}

export function ConsentTag({ value }: { value: ConsentValue }) {
  return value === 'Yes' ? <Tag color="success">Consented</Tag> : <Tag>No consent</Tag>
}
