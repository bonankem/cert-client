import { useQueries } from '@tanstack/react-query'
import { useState } from 'react'
import type { TableColumnsType } from 'antd'
import { adminApi, publicApi } from '@/api'
import QueryState from '@/components/common/QueryState'
import AdminPageHeader from '@/components/layout/AdminPageHeader'
import { ExportCsvButton, ResponseDetailsDrawer } from '@/features/admin'
import { ChartCard, DailyColumns, FeedbackBreakdown, OpcoBars, percent, RecentResponses, StatTile } from '@/features/dashboard'
import { queryKeys } from '@/hooks/queries/keys'
import type { DashboardStats, FormConfig } from '@/types'
import type { ResponseSummary } from '@/types'
import { formatLongDate } from '@/utils/date'

const DAY_COLUMNS: TableColumnsType<DashboardStats['byDay'][number]> = [
  { title: '#', width: 56, align: 'right', render: (_, __, index) => index + 1 },
  { title: 'Day', dataIndex: 'date', render: (d: string) => formatLongDate(d) },
  { title: 'Responses', dataIndex: 'count', align: 'right' },
]
const OPCO_COLUMNS: TableColumnsType<DashboardStats['byOpco'][number]> = [
  { title: '#', width: 56, align: 'right', render: (_, __, index) => index + 1 },
  { title: 'OpCo', dataIndex: 'opco' },
  { title: 'Responses', dataIndex: 'count', align: 'right' },
]

/** Share of the first question answered with its top two options. */
function topTwoShare(stats: DashboardStats): { share: number; label: string } | null {
  const q = stats.questions[0]
  if (!q?.answered) return null
  const top = (q.counts[0]?.count ?? 0) + (q.counts[1]?.count ?? 0)
  return { share: percent(top, q.answered), label: `${q.counts[0]?.option} or ${q.counts[1]?.option?.toLowerCase()}` }
}

function Dashboard({
  stats,
  config,
  onSelectResponse,
}: {
  stats: DashboardStats
  config: FormConfig
  onSelectResponse: (response: ResponseSummary) => void
}) {
  const { responses, consented, certificatesDownloaded } = stats.totals
  const rating = topTwoShare(stats)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4 min-w-0">
        <StatTile hero label="Responses" value={responses.toLocaleString()} detail={`${stats.byOpco.length} OpCos represented`} />
        <StatTile
          label="Rated training highly"
          value={rating ? `${rating.share}%` : '—'}
          meter={rating?.share}
          detail={rating ? `${rating.label}` : 'No answers yet'}
        />
        <StatTile
          label="Certificates downloaded"
          value={`${percent(certificatesDownloaded, responses)}%`}
          meter={percent(certificatesDownloaded, responses)}
          detail={`${certificatesDownloaded} of ${responses} participants`}
        />
        <StatTile
          label="Consented to story"
          value={`${percent(consented, responses)}%`}
          meter={percent(consented, responses)}
          detail={`${consented} of ${responses} participants`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] w-full min-w-0">
        <div className="w-full min-w-0">
          <ChartCard
            title="Responses per day"
            subtitle={`Last ${stats.byDay.length} days (UTC)`}
            table={{ columns: DAY_COLUMNS, rows: stats.byDay, rowKey: 'date' }}
          >
            <DailyColumns data={stats.byDay} />
          </ChartCard>
        </div>
        <div className="w-full min-w-0">
          <ChartCard
            title="Responses by OpCo"
            table={{ columns: OPCO_COLUMNS, rows: stats.byOpco, rowKey: 'opco' }}
          >
            <OpcoBars data={stats.byOpco} total={responses} />
          </ChartCard>
        </div>
      </div>

      <FeedbackBreakdown stats={stats} config={config} />

      <RecentResponses items={stats.recent} onSelect={onSelectResponse} />
    </div>
  )
}

export default function DashboardPage() {
  const [selected, setSelected] = useState<ResponseSummary | null>(null)
  const [stats, config] = useQueries({
    queries: [
      { queryKey: queryKeys.dashboard, queryFn: adminApi.dashboard, refetchInterval: 60_000 },
      { queryKey: queryKeys.formConfig, queryFn: publicApi.formConfig, staleTime: Infinity },
    ],
  })

  const hasData = !!stats.data?.totals.responses

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="How the StableNet training landed, updated as participants submit."
        extra={<ExportCsvButton filters={{}} disabled={!hasData} />}
      />
      <QueryState query={stats}>
        {(s) => (
          <QueryState query={config}>
            {(c) => <Dashboard stats={s} config={c} onSelectResponse={setSelected} />}
          </QueryState>
        )}
      </QueryState>
      <ResponseDetailsDrawer
        certId={selected?.certId ?? null}
        summary={selected ?? undefined}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
