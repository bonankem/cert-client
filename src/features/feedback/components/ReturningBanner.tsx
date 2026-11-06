import { CheckOutlined, ExportOutlined } from '@ant-design/icons'
import { Button } from 'antd'

interface ReturningBannerProps {
  name: string
  /** Button text, e.g. "View my certificate" or "Check my certificate". */
  actionLabel: string
  onAction: () => void
}

/** Glass panel shown in the hero once the participant has submitted on this device. */
export default function ReturningBanner({ name, actionLabel, onAction }: ReturningBannerProps) {
  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-white/6 px-4 py-2.5 backdrop-blur-md sm:flex-nowrap"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-b from-[#4ade80] to-leaf text-white shadow-[0_6px_20px_-6px_rgb(58_170_53/0.8)]">
        <CheckOutlined />
      </span>
      <span aria-hidden className="hidden h-8 w-px bg-white/20 sm:block" />
      <p className="m-0 min-w-0 flex-1 text-[15px] text-white/90">
        You submitted as <strong className="font-extrabold text-white">{name}</strong>.
      </p>
      <Button
        type="primary"
        onClick={onAction}
        className="w-full shadow-[0_10px_30px_-10px_rgb(0_114_206/0.9)] sm:w-auto"
        icon={<ExportOutlined />}
        iconPlacement="end"
      >
        {actionLabel}
      </Button>
    </div>
  )
}
