import { ROUTES } from '@/config/routes'
import NotFoundPage from '@/pages/NotFoundPage'

export default function AdminNotFoundPage() {
  return <NotFoundPage backTo={{ path: ROUTES.admin.responses, label: 'Back to responses' }} />
}
