import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, EditOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Tag, Tooltip } from 'antd'
import type { ApprovalStatus, ConsentValue } from '@/types'

export function ApprovalTag({
  status,
  autoApproved = false,
  reason,
}: {
  status: ApprovalStatus
  autoApproved?: boolean
  reason?: string | null
}) {
  if (status === 'approved') {
    return autoApproved ? (
      <Tooltip title="Approved automatically: on the participant list">
        <Tag color="success" icon={<ThunderboltOutlined />}>
          Auto-approved
        </Tag>
      </Tooltip>
    ) : (
      <Tag color="success" icon={<CheckCircleOutlined />}>
        Approved
      </Tag>
    )
  }
  if (status === 'rejected') {
    const tag = (
      <Tag color="error" icon={<CloseCircleOutlined />}>
        Rejected
      </Tag>
    )
    return reason ? <Tooltip title={`Reason: ${reason}`}>{tag}</Tooltip> : tag
  }
  return (
    <Tag color="warning" icon={<ClockCircleOutlined />}>
      Pending
    </Tag>
  )
}

/** The participant asked to change their approved details. */
export function UpdateRequestedTag() {
  return (
    <Tooltip title="The participant submitted again. Review the changes before they apply.">
      <Tag color="orange" icon={<EditOutlined />}>
        Update requested
      </Tag>
    </Tooltip>
  )
}

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
