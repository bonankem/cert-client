import { CheckOutlined, CopyOutlined, HourglassOutlined, LinkOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Card, Tooltip } from 'antd'
import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import type { SubmissionStatus } from '@/types'
import { formatLongDate } from '@/utils/date'
import { firstName } from '@/utils/text'

type StepState = 'done' | 'current' | 'upcoming'

interface Step {
  title: string
  detail: string
  icon: ReactNode
  state: StepState
}

const STEP_STYLES: Record<StepState, { dot: string; title: string }> = {
  done: {
    dot: 'bg-[#3aaa35] text-white border-[#3aaa35]',
    title: 'text-slate-900 dark:text-slate-100',
  },
  current: {
    dot: 'bg-[#f26a21] text-white border-[#f26a21] shadow-[0_0_0_6px_rgb(242_106_33/0.15)]',
    title: 'text-slate-900 dark:text-slate-100',
  },
  upcoming: {
    dot: 'bg-white text-slate-400 border-slate-300 dark:bg-white/5 dark:border-white/15 dark:text-slate-500',
    title: 'text-slate-400 dark:text-slate-500',
  },
}

/** Three-step tracker: horizontal from `sm`, vertical on phones. */
function ProgressSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="m-0 grid list-none gap-0 p-0 sm:grid-cols-3">
      {steps.map((step, i) => {
        const style = STEP_STYLES[step.state]
        const last = i === steps.length - 1
        return (
          <li key={step.title} className="relative flex gap-3 pb-5 sm:flex-col sm:items-center sm:gap-2 sm:pb-0 sm:text-center">
            {/* connector: down on phones, across from sm */}
            {!last && (
              <span
                aria-hidden
                className={`absolute left-4 top-9 bottom-0 w-0.5 sm:left-[calc(50%+1.5rem)] sm:right-[calc(-50%+1.5rem)] sm:top-4 sm:bottom-auto sm:h-0.5 sm:w-auto ${
                  step.state === 'done' ? 'bg-[#3aaa35]' : 'bg-slate-200 dark:bg-white/10'
                }`}
              />
            )}
            <span className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 text-sm ${style.dot}`}>
              {step.state === 'current' && (
                <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#f26a21]/40" />
              )}
              <span className="relative">{step.icon}</span>
            </span>
            <div className="min-w-0">
              <div className={`text-sm font-semibold ${style.title}`}>{step.title}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{step.detail}</div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/** The private status link in a read-only field with a one-click copy button. */
export function PrivateLinkBox({ link }: { link: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = () => {
    void navigator.clipboard
      ?.writeText(link)
      .then(() => setCopied(true))
      .catch(() => undefined)
  }

  return (
    <div>
      <label htmlFor="private-link" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Your private link
      </label>
      <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-within:border-[#0072ce] dark:border-white/10 dark:bg-white/5">
        <span className="grid place-items-center pl-3 text-slate-400">
          <LinkOutlined />
        </span>
        <input
          id="private-link"
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 truncate bg-transparent px-2.5 py-2.5 font-mono text-[13px] text-slate-700 outline-none dark:text-slate-200"
        />
        <Tooltip title={copied ? 'Copied' : 'Copy link'}>
          <button
            type="button"
            onClick={copy}
            className={`flex shrink-0 items-center gap-1.5 border-l px-3.5 text-[13px] font-semibold transition-colors ${
              copied
                ? 'border-[#3aaa35]/30 bg-[#3aaa35]/10 text-[#2f8f2b] dark:text-[#6fd36b]'
                : 'border-slate-200 bg-white text-[#0072ce] hover:bg-sky-50 dark:border-white/10 dark:bg-white/5 dark:text-sky-300 dark:hover:bg-white/10'
            }`}
          >
            {copied ? <CheckOutlined /> : <CopyOutlined />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </Tooltip>
      </div>
      <p className="mt-1.5 mb-0 text-xs text-slate-500 dark:text-slate-400">
        Bookmark it or keep the email we sent. Anyone with this link can see your certificate, so don’t share it.
      </p>
    </div>
  )
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
    <dd className="m-0 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</dd>
  </div>
)

interface PendingStatusCardProps {
  status: SubmissionStatus
  /** When the status was last fetched (for the live indicator). */
  checkedAt: number
}

/** "Awaiting approval" screen on the participant's private status page. */
export default function PendingStatusCard({ status, checkedAt }: PendingStatusCardProps) {
  const link = typeof window === 'undefined' ? '' : window.location.href
  const checkedTime = new Date(checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <Card classNames={{ body: 'p-5! sm:p-7!' }}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f26a21]/12 text-xl text-[#f26a21]">
            <HourglassOutlined />
          </span>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f26a21]/10 px-2.5 py-0.5 text-xs font-semibold text-[#c4520f] dark:text-[#ff9a5c]">
              <span className="size-1.5 rounded-full bg-[#f26a21]" />
              Awaiting approval
            </span>
            <h2 className="mt-1.5 mb-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">
              Thanks, {firstName(status.name)}. Your feedback is in.
            </h2>
            <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              The training team reviews every submission before issuing a certificate. We’ll email you the moment yours is
              approved.
            </p>
          </div>
        </div>

        <ProgressSteps
          steps={[
            { title: 'Submitted', detail: formatLongDate(status.submittedAt), icon: <CheckOutlined />, state: 'done' },
            { title: 'Under review', detail: 'By the training team', icon: <HourglassOutlined />, state: 'current' },
            { title: 'Certificate ready', detail: 'Download as PDF', icon: <SafetyCertificateOutlined />, state: 'upcoming' },
          ]}
        />

        <PrivateLinkBox link={link} />

        {/* What was submitted + live indicator */}
        <div className="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
          <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:gap-8">
            <Detail label="Name on certificate" value={status.name} />
            <Detail label="OpCo" value={status.opco} />
          </dl>
          <span className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#3aaa35] opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-[#3aaa35]" />
            </span>
            Checking for updates · last checked {checkedTime}
          </span>
        </div>

        <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
          Spotted a mistake in your name?{' '}
          <Link to={ROUTES.feedback} className="font-semibold">
            Submit the form again
          </Link>{' '}
          with the same email address. It replaces this submission; no second certificate is created.
        </p>
      </div>
    </Card>
  )
}
