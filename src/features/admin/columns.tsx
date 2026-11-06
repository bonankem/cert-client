/*
 * Column builders for the server-driven tables. Sorting and filtering are
 * controlled by the URL query, so each column reflects the current state.
 */
import { Typography, type TableColumnType } from 'antd'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import type { FormConfig, ListResponsesQuery, ResponseSummary, SortField } from '@/types'
import { formatDateTime, formatLongDate } from '@/utils/date'
import { ConsentTag, DownloadStatusTag } from './components/StatusTags'

export type Column = TableColumnType<ResponseSummary>

const sortable = (key: SortField, query: ListResponsesQuery): Partial<Column> => ({
  key,
  sorter: true,
  sortOrder: query.sortField === key ? query.sortOrder : null,
  sortDirections: ['descend', 'ascend'],
})

export const nameColumn = (query: ListResponsesQuery): Column => ({
  ...sortable('name', query),
  title: 'Name',
  fixed: 'left',
  render: (_, r) => <Link to={ROUTES.admin.response(r.certId)}>{r.name}</Link>,
})

export const opcoColumn = (config: FormConfig, query: ListResponsesQuery): Column => ({
  key: 'opco',
  title: 'OpCo',
  dataIndex: 'opco',
  filters: config.opcos.map((o) => ({ text: o, value: o })),
  filteredValue: query.opco ?? null,
  filterSearch: true,
})

export const consentColumn = (query: ListResponsesQuery): Column => ({
  key: 'consent',
  title: 'Consent',
  filters: [
    { text: 'Consented', value: 'Yes' },
    { text: 'No consent', value: 'No' },
  ],
  filterMultiple: false,
  filteredValue: query.consent ? [query.consent] : null,
  render: (_, r) => <ConsentTag value={r.consent} />,
})

export const answerColumns = (config: FormConfig): Column[] =>
  config.questions.map((q) => ({
    key: q.id,
    title: q.label,
    render: (_, r) => r.answers[q.id] ?? '—',
  }))

export const submittedColumn = (query: ListResponsesQuery, title = 'Submitted'): Column => ({
  ...sortable('submittedAt', query),
  title,
  render: (_, r) => formatLongDate(r.submittedAt),
})

export const certIdColumn: Column = {
  key: 'certId',
  title: 'Certificate ID',
  render: (_, r) => (
    <Typography.Text copyable={{ text: r.certId }} className="font-mono text-sm whitespace-nowrap">
      {r.certId}
    </Typography.Text>
  ),
}

export const downloadStatusColumn = (query: ListResponsesQuery): Column => ({
  ...sortable('participantDownloads', query),
  title: 'Certificate',
  render: (_, r) => <DownloadStatusTag count={r.participantDownloads} />,
})

export const lastDownloadedColumn = (query: ListResponsesQuery): Column => ({
  ...sortable('lastDownloadedAt', query),
  title: 'Last downloaded',
  render: (_, r) => (r.lastDownloadedAt ? formatDateTime(r.lastDownloadedAt) : '—'),
})
