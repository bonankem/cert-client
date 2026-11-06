import { CheckCircleOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Input, Segmented, type TableColumnType } from 'antd'
import { useMemo, useState, type Key } from 'react'
import AdminPageHeader from '@/components/layout/AdminPageHeader'
import {
  columns as col,
  ExportCsvButton,
  ResponseDetailsDrawer,
  ResponsesTable,
  useResponseQueryParams,
  useReviewActions,
} from '@/features/admin'
import CertificateActions from '@/features/admin/components/CertificateActions'
import { useDashboard, useResponseList } from '@/hooks/queries/admin'
import { useFormConfig } from '@/hooks/queries/public'
import type { ApprovalStatus, ResponseSummary } from '@/types'

/** Tabs: an approval status, all, or "update requests" (approved responses with pending changes). */
type ApprovalFilter = ApprovalStatus | 'all' | 'updates'

export default function ResponsesPage() {
  const { query, update, onTableChange } = useResponseQueryParams()
  const list = useResponseList(query)
  const config = useFormConfig()
  const totals = useDashboard().data?.totals
  const { approve, approving } = useReviewActions()
  const [selected, setSelected] = useState<ResponseSummary | null>(null)
  const [checked, setChecked] = useState<ResponseSummary[]>([])

  const columns = useMemo(
    () =>
      config.data
        ? [
            col.nameColumn(query),
            col.approvalColumn,
            col.emailColumn,
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

  const { search, opco, consent, status, approval, updates } = query
  const count = (n: number | undefined) => (n === undefined ? '' : ` (${n})`)
  const approvalOptions: { value: ApprovalFilter; label: string }[] = [
    { value: 'all', label: `All${count(totals?.responses)}` },
    { value: 'pending', label: `Pending${count(totals?.pending)}` },
    { value: 'updates', label: `Update requests${count(totals?.updateRequests)}` },
    { value: 'approved', label: `Approved${count(totals?.approved)}` },
    { value: 'rejected', label: `Rejected${count(totals?.rejected)}` },
  ]
  const activeTab: ApprovalFilter = updates ? 'updates' : (approval ?? 'all')

  const changeApproval = (value: ApprovalFilter) => {
    setChecked([])
    update({
      approval: value === 'all' || value === 'updates' ? undefined : value,
      updates: value === 'updates' ? 'pending' : undefined,
    })
  }

  return (
    <>
      <AdminPageHeader
        title="Responses"
        description="Feedback submitted by participants. Approve each certificate before the participant can download it."
        extra={<ExportCsvButton filters={{ search, opco, consent, status, approval, updates }} disabled={!list.data?.total} />}
      />
      <Card>
        <Flex gap={12} wrap align="center" className="mb-4">
          <Segmented<ApprovalFilter> size="small" options={approvalOptions} value={activeTab} onChange={changeApproval} />
          <Input.Search
            size="small"
            key={search ?? ''}
            defaultValue={search}
            placeholder="Search name, email, OpCo or certificate ID"
            allowClear
            className="max-w-sm"
            onSearch={(value) => update({ search: value.trim() || undefined })}
          />
          {checked.length > 0 && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              loading={approving}
              onClick={() => approve(checked, () => setChecked([]))}
            >
              Approve selected ({checked.length})
            </Button>
          )}
        </Flex>
        <ResponsesTable
          columns={columns}
          data={list.data}
          loading={list.isFetching || config.isPending}
          onChange={onTableChange}
          emptyText={
            search || opco || consent || approval || updates ? 'No responses match these filters.' : 'No responses yet.'
          }
          onSelect={setSelected}
          rowSelection={{
            selectedRowKeys: checked.map((r) => r.certId),
            preserveSelectedRowKeys: true,
            getCheckboxProps: (r) => ({ disabled: r.status === 'approved', title: r.status === 'approved' ? 'Already approved' : undefined }),
            onChange: (_: Key[], rows: ResponseSummary[]) => setChecked(rows.filter(Boolean)),
          }}
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
