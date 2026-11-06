import { DownloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { adminApi } from '@/api'
import type { ResponseFilters } from '@/types'

/** Downloads the CSV straight from the API (session cookie), using the current filters. */
export default function ExportCsvButton({ filters, disabled }: { filters: ResponseFilters; disabled?: boolean }) {
  return (
    <Button icon={<DownloadOutlined />} href={adminApi.exportCsvUrl(filters)} disabled={disabled}>
      Export CSV
    </Button>
  )
}
