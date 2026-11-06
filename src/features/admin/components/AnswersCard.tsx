import { Card, Tag, Typography } from 'antd'
import type { AnswerMap, FormConfig } from '@/types'

interface AnswersCardProps {
  answers: AnswerMap
  config: FormConfig
}

export default function AnswersCard({ answers, config }: AnswersCardProps) {
  return (
    <Card title="Feedback">
      <div className="flex flex-col gap-5">
        {config.sections.map((section) => (
          <section key={section.id}>
            <div className="mb-3">
              <Typography.Title level={5} className="mb-1!">{section.title}</Typography.Title>
              <Typography.Text type="secondary">{section.lead}</Typography.Text>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {config.questions
                .filter((question) => question.section === section.id)
                .map((question, index) => (
                  <div key={question.id} className="flex min-h-28 flex-col justify-between gap-4 rounded-xl border border-black/6 bg-black/[0.015] p-4 dark:border-white/8 dark:bg-white/[0.025]">
                    <Typography.Text className="font-medium">
                      <span className="mr-2 text-sm opacity-45">{index + 1}.</span>
                      {question.text}
                    </Typography.Text>
                    <div>
                      {answers[question.id] ? (
                        <Tag color="processing" className="m-0! px-2.5! py-1! text-sm!">{answers[question.id]}</Tag>
                      ) : (
                        <Typography.Text type="secondary" className="text-sm">No response recorded</Typography.Text>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </Card>
  )
}
