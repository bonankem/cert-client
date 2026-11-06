import { Button, Card, Flex, Input, Segmented, Tag, type TableColumnType } from 'antd'
import { Link } from 'react-router-dom'
import { SettingOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import AdminPageHeader from '@/components/layout/AdminPageHeader'
import { ROUTES } from '@/config/routes'
import { CertificateActions, columns as col, ResponseDetailsDrawer, ResponsesTable, useResponseQueryParams } from '@/features/admin'
import { useDashboard, useResponseList } from '@/hooks/queries/admin'
import { useCertificateSettings, useFormConfig } from '@/hooks/queries/public'
import type { DownloadStatus, ResponseSummary } from '@/types'

type StatusFilter = DownloadStatus | 'all'

export default function CertificatesPage() {
  const { query, update, onTableChange } = useResponseQueryParams()
  // Only approved responses have an issued certificate.
  const list = useResponseList(useMemo(() => ({ ...query, approval: 'approved' as const }), [query]))
  const config = useFormConfig()
  const { settings } = useCertificateSettings()
  const totals = useDashboard().data?.totals
  const [selected, setSelected] = useState<ResponseSummary | null>(null)

  const columns = useMemo(
    () =>
      config.data
        ? [
            col.nameColumn(query),
            col.opcoColumn(config.data, query),
            col.certIdColumn,
            col.submittedColumn(query, 'Issued'),
            col.downloadStatusColumn(query),
            col.lastDownloadedColumn(query),
            {
              key: 'actions',
              title: '',
              fixed: 'right',
              width: 64,
              render: (_, record) => <CertificateActions record={record} onView={setSelected} />,
            } satisfies TableColumnType<ResponseSummary>,
          ]
        : [],
    [config.data, query],
  )

  const count = (n: number | undefined) => (n === undefined ? '' : ` (${n})`)
  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: `All${count(totals?.approved)}` },
    { value: 'downloaded', label: `Downloaded${count(totals?.certificatesDownloaded)}` },
    {
      value: 'pending',
      label: `Not downloaded${count(totals && totals.approved - totals.certificatesDownloaded)}`,
    },
  ]

  return (
    <>
      <AdminPageHeader
        title="Certificates"
        description="Every approved certificate, and whether the participant has downloaded it. Pending ones are under Responses."
        extra={
          <Flex align="center" gap={10}>
            <Tag color={settings.designVariant === 'modern' ? 'blue' : 'cyan'} className="py-1 px-2.5 text-xs">
              Template: <strong>{settings.designVariant === 'modern' ? 'Styled Certificate' : 'Minimalist Certificate'}</strong>
            </Tag>
            <Link to={ROUTES.admin.settings}>
              <Button icon={<SettingOutlined />} size="small">
                Change Design
              </Button>
            </Link>
          </Flex>
        }
      />
      <Card>
        <Flex gap={12} wrap align="center" className="mb-4">
          <Segmented<StatusFilter>
            size="small"
            options={statusOptions}
            value={query.status ?? 'all'}
            onChange={(value) => update({ status: value === 'all' ? undefined : value })}
          />
          <Input.Search
            size="small"
            key={query.search ?? ''}
            defaultValue={query.search}
            placeholder="Search name, OpCo or certificate ID"
            allowClear
            className="max-w-sm"
            onSearch={(value) => update({ search: value.trim() || undefined })}
          />
        </Flex>
        <ResponsesTable
          columns={columns}
          data={list.data}
          loading={list.isFetching || config.isPending}
          onChange={onTableChange}
          emptyText="No certificates match this filter."
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
