import { Table, type TableProps } from 'antd'
import type { Paginated, ResponseSummary } from '@/types'
import type { Column } from '../columns'

interface ResponsesTableProps {
  columns: Column[]
  data: Paginated<ResponseSummary> | undefined
  loading: boolean
  onChange: NonNullable<TableProps<ResponseSummary>['onChange']>
  emptyText: string
  /** Open the selected participant details. */
  onSelect?: (record: ResponseSummary) => void
  /** Checkbox selection (e.g. for approving several at once). */
  rowSelection?: TableProps<ResponseSummary>['rowSelection']
}

/** Server-paginated table shared by the Responses and Certificates pages. */
export default function ResponsesTable({
  columns,
  data,
  loading,
  onChange,
  emptyText,
  onSelect,
  rowSelection,
}: ResponsesTableProps) {
  const numberedColumns: Column[] = [
    {
      key: 'serial',
      title: '#',
      width: 64,
      fixed: 'left',
      align: 'right',
      render: (_, __, index) => ((data?.page ?? 1) - 1) * (data?.pageSize ?? 10) + index + 1,
    },
    ...columns,
  ]

  return (
    <Table<ResponseSummary>
      rowKey="certId"
      size="small"
      columns={numberedColumns}
      dataSource={data?.items}
      loading={loading}
      onChange={onChange}
      rowSelection={rowSelection}
      scroll={{ x: 'max-content' }}
      locale={{ emptyText }}
      pagination={{
        current: data?.page,
        pageSize: data?.pageSize,
        total: data?.total,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
        showTotal: (total, [from, to]) => `${from}–${to} of ${total}`,
        hideOnSinglePage: false,
      }}
      onRow={onSelect ? (record) => ({
        className: 'cursor-pointer',
        onClick: (event) => {
          if ((event.target as HTMLElement).closest('a,button,[role=button]')) return
          onSelect(record)
        },
      }) : undefined}
    />
  )
}
