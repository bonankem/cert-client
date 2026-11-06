import type { TableColumnsType } from 'antd'
import type { DashboardStats, FormConfig, QuestionStats } from '@/types'
import { percent } from '../scale'
import ChartCard from './ChartCard'
import LikertBar, { LikertLegend } from './LikertBar'

type Row = { key: string; question: string; option: string; count: number; share: string }

const COLUMNS: TableColumnsType<Row> = [
  { title: 'Question', dataIndex: 'question' },
  { title: 'Answer', dataIndex: 'option' },
  { title: 'Count', dataIndex: 'count', align: 'right' },
  { title: 'Share', dataIndex: 'share', align: 'right' },
]

const toRows = (questions: QuestionStats[]): Row[] =>
  questions.flatMap((q) =>
    q.counts.map((c) => ({
      key: `${q.id}-${c.option}`,
      question: q.label,
      option: c.option,
      count: c.count,
      share: `${percent(c.count, q.answered)}%`,
    })),
  )

/** One card per form section, each question as a segmented bar on that section's scale. */
export default function FeedbackBreakdown({ stats, config }: { stats: DashboardStats; config: FormConfig }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {config.sections.map((section) => {
        const questions = stats.questions.filter((q) => q.section === section.id)
        const scale = questions[0]?.counts.map((c) => c.option) ?? []
        return (
          <ChartCard
            key={section.id}
            title={section.title}
            subtitle="Share of answers, best to worst"
            table={{ columns: COLUMNS, rows: toRows(questions), rowKey: 'key' }}
          >
            <div className="flex flex-col gap-4">
              {questions.map((q) => (
                <LikertBar key={q.id} question={q} />
              ))}
              <LikertLegend options={scale} />
            </div>
          </ChartCard>
        )
      })}
    </div>
  )
}
