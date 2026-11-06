import { Tooltip } from 'antd'
import type { QuestionStats } from '@/types'
import { fillVar, inkVar, percent, scaleStep } from '../scale'

/** Shares narrower than this don't get an inline label (they stay in the tooltip/table). */
const MIN_LABEL_SHARE = 9

/** One question as a 100% segmented bar, best → worst. */
export default function LikertBar({ question }: { question: QuestionStats }) {
  const { counts, answered } = question
  const description = counts.map((c) => `${c.option} ${percent(c.count, answered)}%`).join(', ')

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold">{question.label}</span>
        <span className="shrink-0 opacity-60">{answered} answered</span>
      </div>
      {answered === 0 ? (
        <div className="h-7 rounded border border-dashed border-black/15 dark:border-white/15" />
      ) : (
        <div className="flex h-7 gap-0.5" role="img" aria-label={`${question.label}: ${description}`}>
          {counts.map((c, i) => {
            if (c.count === 0) return null
            const share = percent(c.count, answered)
            const step = scaleStep(i, counts.length)
            return (
              <Tooltip key={c.option} title={`${c.option}: ${c.count} (${share}%)`}>
                <div
                  className="flex cursor-default items-center rounded px-2 text-xs font-semibold tabular-nums"
                  style={{ flexGrow: c.count, flexBasis: 0, background: fillVar(step), color: inkVar(step) }}
                >
                  {share >= MIN_LABEL_SHARE ? `${share}%` : ''}
                </div>
              </Tooltip>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Legend for a scale, in block order. */
export function LikertLegend({ options }: { options: readonly string[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-xs opacity-80">
      {options.map((option, i) => (
        <li key={option} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block size-2.5 rounded-sm ring-1 ring-black/10 dark:ring-white/10"
            style={{ background: fillVar(scaleStep(i, options.length)) }}
          />
          {option}
        </li>
      ))}
    </ul>
  )
}
