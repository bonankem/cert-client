import { Card, Input, type TableColumnType } from 'antd'
import { useMemo, useState } from 'react'
import AdminPageHeader from '@/components/layout/AdminPageHeader'
import { columns as col, ExportCsvButton, ResponseDetailsDrawer, ResponsesTable, useResponseQueryParams } from '@/features/admin'
import CertificateActions from '@/features/admin/components/CertificateActions'
import { useResponseList } from '@/hooks/queries/admin'
import { useFormConfig } from '@/hooks/queries/public'
import type { ResponseSummary } from '@/types'

export default function ResponsesPage() {
  const { query, update, onTableChange } = useResponseQueryParams()
  const list = useResponseList(query)
  const config = useFormConfig()
  const [selected, setSelected] = useState<ResponseSummary | null>(null)

  const columns = useMemo(
    () =>
      config.data
        ? [
            col.nameColumn(query),
            col.opcoColumn(config.data, query),
            col.consentColumn(query),
            ...col.answerColumns(config.data),
            col.submittedColumn(query),
            col.downloadStatusColumn(query),
            {
              key: 'actions',
              title: '',
              width: 64,
              fixed: 'right',
              render: (_: unknown, record: ResponseSummary) => (
                <CertificateActions record={record} onView={setSelected} />
              ),
            } satisfies TableColumnType<ResponseSummary>,
          ]
        : [],
    [config.data, query],
  )

  const { search, opco, consent, status } = query

  return (
    <>
      <AdminPageHeader
        title="Responses"
        description="Feedback submitted by participants. Click a row to open the full response and certificate."
        extra={<ExportCsvButton filters={{ search, opco, consent, status }} disabled={!list.data?.total} />}
      />
      <Card>
        <Input.Search
          size="small"
          key={search ?? ''}
          defaultValue={search}
          placeholder="Search by name, OpCo or certificate ID"
          allowClear
          className="mb-4 max-w-md"
          onSearch={(value) => update({ search: value.trim() || undefined })}
        />
        <ResponsesTable
          columns={columns}
          data={list.data}
          loading={list.isFetching || config.isPending}
          onChange={onTableChange}
          emptyText={search || opco || consent ? 'No responses match these filters.' : 'No responses yet.'}
          onSelect={setSelected}
        />
      </Card>
      <ResponseDetailsDrawer
        certId={selected?.certId ?? null}
        summary={selected ?? undefined}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
