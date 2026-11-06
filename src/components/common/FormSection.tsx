import { Typography } from 'antd'
import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  lead?: string
  children: ReactNode
}

/** A titled block inside a long form, separated from the next by a rule. */
export default function FormSection({ title, lead, children }: FormSectionProps) {
  return (
    <section className="border-b border-black/10 py-2.5 sm:py-3.5 last:border-b-0 dark:border-white/10">
      <h3 className="mb-0.5 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      {lead && (
        <p className="mb-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-normal">
          {lead}
        </p>
      )}
      {children}
    </section>
  )
}
