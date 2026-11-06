import { ArrowRightOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Card, Flex } from 'antd'
import type { FormConfig, ResponseDetail } from '@/types'
import { formatDateTime } from '@/utils/date'
import { useReviewActions } from '../hooks/useReviewActions'

interface Change {
  label: string
  from: string
  to: string
}

/** Only the fields the participant actually changed. */
function changesOf(response: ResponseDetail, config: FormConfig): Change[] {
  const request = response.updateRequest
  if (!request) return []
  const changes: Change[] = []
  const add = (label: string, from: string | undefined, to: string | undefined) => {
    if ((from ?? '') !== (to ?? '')) changes.push({ label, from: from || '—', to: to || '—' })
  }
  add('Name on certificate', response.name, request.name)
  add('OpCo', response.opco, request.opco)
  add('Success story consent', response.consent, request.consent)
  for (const q of config.questions) add(q.label, response.answers[q.id], request.answers[q.id])
  return changes
}

/** The participant's pending update request: what changes, with approve / reject. */
export default function UpdateRequestCard({ response, config }: { response: ResponseDetail; config: FormConfig }) {
  const { approveUpdate, rejectUpdate, approvingUpdate } = useReviewActions()
  const request = response.updateRequest
  if (!request) return null
  const changes = changesOf(response, config)

  return (
    <Card
      className="border-[#f26a21]/40!"
      title={
        <span className="flex items-center gap-2">
          <EditOutlined className="text-[#f26a21]" />
          Update request
        </span>
      }
      extra={<span className="text-xs text-slate-500">Requested {formatDateTime(request.requestedAt)}</span>}
    >
      <p className="mt-0 mb-3 text-sm text-slate-600 dark:text-slate-300">
        {response.name} submitted the form again. Their current certificate stays valid until you decide. Approving
        applies these changes to the same certificate (same ID and code).
      </p>

      {changes.length ? (
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-white/10">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead className="bg-slate-50 text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2 font-semibold">Field</th>
                <th className="px-3 py-2 font-semibold">Current</th>
                <th aria-hidden className="w-6" />
                <th className="px-3 py-2 font-semibold">Requested</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((c) => (
                <tr key={c.label} className="border-t border-slate-200 align-top dark:border-white/10">
                  <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200">{c.label}</td>
                  <td className="px-3 py-2 text-slate-500 line-through decoration-slate-300 dark:text-slate-400">{c.from}</td>
                  <td className="py-2 text-slate-400">
                    <ArrowRightOutlined />
                  </td>
                  <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">{c.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="m-0 text-sm text-slate-500">The resubmitted details are the same as the current ones.</p>
      )}

      <Flex gap={8} wrap className="mt-4">
        <Button type="primary" icon={<CheckCircleOutlined />} loading={approvingUpdate} onClick={() => approveUpdate(response)}>
          Approve update
        </Button>
        <Button danger icon={<CloseCircleOutlined />} onClick={() => rejectUpdate(response)}>
          Reject update
        </Button>
      </Flex>
    </Card>
  )
}
