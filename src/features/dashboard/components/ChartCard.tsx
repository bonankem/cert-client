import { BarChartOutlined, TableOutlined } from '@ant-design/icons'
import { Card, Segmented, Table, type TableColumnsType } from 'antd'
import { useState, type ReactNode } from 'react'

export interface ChartTable<Row> {
  columns: TableColumnsType<Row>
  rows: Row[]
  rowKey: keyof Row & string
}

interface ChartCardProps<Row> {
  title: string
  subtitle?: string
  children: ReactNode
  /** Every chart has a table view, so no value depends on colour alone. */
  table: ChartTable<Row>
  extra?: ReactNode
}

export default function ChartCard<Row extends object>({
  title,
  subtitle,
  children,
  table,
  extra,
}: ChartCardProps<Row>) {
  const [view, setView] = useState<'chart' | 'table'>('chart')

  return (
    <Card
      className="h-full w-full min-w-0 overflow-hidden"
      classNames={{
        header: 'px-3 sm:px-4 py-2 sm:py-3 min-w-0 flex-wrap sm:flex-nowrap gap-2',
        body: 'p-3 sm:p-4 min-w-0 overflow-hidden',
      }}
      title={
        <div className="min-w-0 max-w-[200px] sm:max-w-none">
          <div className="truncate text-xs sm:text-sm md:text-base font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </div>
          {subtitle && (
            <div className="truncate text-[11px] sm:text-xs font-normal text-slate-500 dark:text-slate-400">
              {subtitle}
            </div>
          )}
        </div>
      }
      extra={
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {extra}
          <Segmented
            size="small"
            value={view}
            onChange={(v) => setView(v as 'chart' | 'table')}
            options={[
              { value: 'chart', icon: <BarChartOutlined className="text-xs" />, title: 'Chart view' },
              { value: 'table', icon: <TableOutlined className="text-xs" />, title: 'Table view' },
            ]}
          />
        </div>
      }
    >
      <div className="w-full min-w-0 overflow-hidden">
        {view === 'chart' ? (
          children
        ) : (
          <div className="w-full min-w-0 overflow-x-auto">
            <Table<Row>
              size="small"
              columns={table.columns}
              dataSource={table.rows}
              rowKey={table.rowKey}
              pagination={false}
              scroll={{ x: 'max-content', y: 320 }}
            />
          </div>
        )}
      </div>
    </Card>
  )
}
