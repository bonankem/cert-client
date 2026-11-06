import { Tooltip } from 'antd'
import type { DashboardStats } from '@/types'

const PLOT_HEIGHT = 150

const shortDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })

const tinyDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', timeZone: 'UTC' })

/** A clean axis maximum (1, 2, 5, 10, 20, 50…) with a mid tick. */
function niceMax(value: number): number {
  if (value <= 4) return Math.max(value, 2) + (value % 2)
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 5, 10].find((m) => m * magnitude >= value) ?? 10
  return step * magnitude
}

/** Single-series column chart: responses per day (responsive & mobile-safe). */
export default function DailyColumns({ data }: { data: DashboardStats['byDay'] }) {
  const max = niceMax(Math.max(...data.map((d) => d.count), 1))
  const ticks = [max, max / 2, 0]
  const peak = Math.max(...data.map((d) => d.count))

  // Determine tick interval: on desktop show more, on mobile show 4-5 dates max to prevent overflow
  const count = data.length
  // Step for labels: 14 days -> show every 3rd or 4th day
  const step = count <= 7 ? 1 : count <= 14 ? 3 : Math.ceil(count / 5)

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <div
        className="flex w-full min-w-0 gap-1.5 sm:gap-2"
        role="img"
        aria-label={`Responses per day over the last ${data.length} days`}
      >
        {/* y-axis ticks */}
        <div
          className="relative w-5 sm:w-6 shrink-0 text-right text-[11px] sm:text-xs tabular-nums select-none"
          style={{ height: PLOT_HEIGHT, color: 'var(--viz-muted)' }}
        >
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${(1 - t / max) * 100}%` }}
            >
              {Number.isInteger(t) ? t : ''}
            </span>
          ))}
        </div>

        {/* Plot area */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="relative w-full" style={{ height: PLOT_HEIGHT }}>
            {/* hairline grid + baseline */}
            {ticks.map((t) => (
              <div
                key={t}
                className="absolute inset-x-0 h-px"
                style={{
                  top: `${(1 - t / max) * 100}%`,
                  background: t === 0 ? 'var(--viz-baseline)' : 'var(--viz-grid)',
                }}
              />
            ))}

            <div className="absolute inset-0 flex items-end gap-0.5 sm:gap-1">
              {data.map((d) => (
                <Tooltip
                  key={d.date}
                  title={`${shortDay(d.date)}: ${d.count} response${d.count === 1 ? '' : 's'}`}
                >
                  <div className="relative flex h-full flex-1 cursor-default items-end justify-center min-w-0">
                    {d.count > 0 && d.count === peak && (
                      <span
                        className="absolute text-[10px] sm:text-xs font-semibold tabular-nums text-slate-800 dark:text-slate-100"
                        style={{ bottom: `calc(${(d.count / max) * 100}% + 2px)` }}
                      >
                        {d.count}
                      </span>
                    )}
                    <div
                      className="w-full max-w-4 sm:max-w-6 rounded-t transition-all duration-300"
                      style={{
                        height: d.count > 0 ? `${(d.count / max) * 100}%` : '2px',
                        background: d.count > 0 ? 'var(--viz-series)' : 'rgba(150, 150, 150, 0.15)',
                      }}
                    />
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* x-axis labels with smart truncation & interval */}
          <div className="mt-2 flex w-full min-w-0 gap-0.5 text-[10px] sm:text-xs text-slate-500 dark:text-zinc-400 select-none">
            {data.map((d, i) => {
              const isMarked = i % step === 0 || i === data.length - 1
              return (
                <span
                  key={d.date}
                  className="flex-1 min-w-0 text-center truncate"
                  title={shortDay(d.date)}
                >
                  {isMarked ? (
                    <>
                      <span className="hidden sm:inline">{shortDay(d.date)}</span>
                      <span className="sm:hidden">{tinyDay(d.date)}</span>
                    </>
                  ) : (
                    ''
                  )}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
