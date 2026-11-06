import { Card, Progress } from 'antd'
import type { ReactNode } from 'react'

interface StatTileProps {
  label: string
  value: ReactNode
  /** Secondary line under the value, e.g. "18 of 24". */
  detail?: ReactNode
  /** 0–100: shows a thin meter under the value. */
  meter?: number
  /** The dashboard's single hero figure (larger). */
  hero?: boolean
}

export default function StatTile({ label, value, detail, meter, hero = false }: StatTileProps) {
  return (
    <Card size="small" className="h-full min-w-0" classNames={{ body: 'p-2.5! sm:p-3.5!' }}>
      <div className="text-[11px] sm:text-xs opacity-75 font-medium truncate" title={label}>{label}</div>
      <div className={`mt-0.5 sm:mt-1 leading-tight font-bold tabular-nums truncate ${hero ? 'text-xl sm:text-3xl lg:text-4xl' : 'text-base sm:text-2xl'}`}>{value}</div>
      {meter !== undefined && (
        <Progress
          percent={meter}
          showInfo={false}
          size={['100%', 3]}
          strokeColor="var(--viz-series)"
          className="mt-2! sm:mt-2.5! mb-0!"
          aria-label={`${label}: ${meter}%`}
        />
      )}
      {detail && <div className="mt-1 sm:mt-1.5 text-[10px] sm:text-xs opacity-70 truncate" title={typeof detail === 'string' ? detail : undefined}>{detail}</div>}
    </Card>
  )
}
