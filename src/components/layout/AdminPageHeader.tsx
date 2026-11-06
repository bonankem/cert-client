import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AdminPageHeaderProps {
  title: ReactNode
  description?: ReactNode
  /** Right-aligned actions. */
  extra?: ReactNode
  /** Show a back link to this path. */
  backTo?: { path: string; label: string }
}

export default function AdminPageHeader({ title, description, extra, backTo }: AdminPageHeaderProps) {
  return (
    <div className="mb-5">
      {backTo && (
        <Link to={backTo.path}>
          <Button type="link" icon={<ArrowLeftOutlined />} className="mb-1 px-0!">
            {backTo.label}
          </Button>
        </Link>
      )}
      <Flex justify="space-between" align="flex-start" gap={12} wrap>
        <div className="min-w-0">
          <h1 className="mb-0.5 text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          {description && (
            <p className="mb-0 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        {extra && (
          <Flex gap={8} wrap>
            {extra}
          </Flex>
        )}
      </Flex>
    </div>
  )
}
