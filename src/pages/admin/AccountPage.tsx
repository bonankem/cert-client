import { Card, Descriptions } from 'antd'
import AdminPageHeader from '@/components/layout/AdminPageHeader'
import { ChangePasswordForm } from '@/features/admin'
import { useMe } from '@/hooks/queries/auth'
import { formatDateTime } from '@/utils/date'

export default function AccountPage() {
  const user = useMe().data

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <AdminPageHeader title="Account" />
      {user && (
        <Card title="Signed in as">
          <Descriptions
            column={1}
            size="small"
            items={[
              { key: 'name', label: 'Name', children: user.name },
              { key: 'email', label: 'Email', children: user.email },
              { key: 'role', label: 'Role', children: 'Administrator' },
              { key: 'last', label: 'This sign-in', children: user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '—' },
            ]}
          />
        </Card>
      )}
      <ChangePasswordForm />
    </div>
  )
}
