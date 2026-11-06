import { Tooltip } from 'antd'
import type { DashboardStats } from '@/types'
import { percent } from '../scale'

/** Horizontal bars, sorted by count, value at the bar's tip. Responsive & mobile-safe. */
export default function OpcoBars({ data, total }: { data: DashboardStats['byOpco']; total: number }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[150px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-zinc-800 text-center p-4">
        <p className="text-xs text-slate-500 dark:text-zinc-400 m-0">No OpCo data recorded yet</p>
        <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
          Submissions will be automatically grouped by MTN OpCo here.
        </span>
      </div>
    )
  }

  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0 w-full min-w-0">
        {data.map((d) => {
          const barWidthPercent = Math.max(4, Math.round((d.count / max) * 100))
          const sharePercent = percent(d.count, total)

          return (
            <li
              key={d.opco}
              className="grid grid-cols-[minmax(0,5.5rem)_1fr] sm:grid-cols-[minmax(0,8rem)_1fr] items-center gap-2 sm:gap-3 text-xs sm:text-sm w-full min-w-0"
            >
              <span className="truncate font-medium text-slate-700 dark:text-zinc-300" title={d.opco}>
                {d.opco}
              </span>
              <Tooltip title={`${d.opco}: ${d.count} (${sharePercent}% of responses)`}>
                <div className="flex min-w-0 w-full cursor-default items-center gap-2">
                  <div className="flex-1 min-w-0 flex items-center h-4 bg-slate-100/60 dark:bg-zinc-800/40 rounded-r overflow-hidden">
                    <div
                      className="h-full rounded-r transition-all duration-300"
                      style={{
                        width: `${barWidthPercent}%`,
                        background: 'var(--viz-series)',
                      }}
                    />
                  </div>
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-600 dark:text-zinc-300 min-w-[20px] text-right">
                    {d.count}
                  </span>
                </div>
              </Tooltip>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
