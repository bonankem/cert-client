import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

interface NotFoundPageProps {
  title?: string
  subTitle?: string
  backTo?: { path: string; label: string }
}

export default function NotFoundPage({
  title = 'Page not found',
  subTitle = 'The page you’re looking for doesn’t exist.',
  backTo = { path: ROUTES.feedback, label: 'Go to the feedback form' },
}: NotFoundPageProps) {
  return (
    <Result
      status="404"
      title={title}
      subTitle={subTitle}
      extra={
        <Link to={backTo.path}>
          <Button type="primary">{backTo.label}</Button>
        </Link>
      }
    />
  )
}
