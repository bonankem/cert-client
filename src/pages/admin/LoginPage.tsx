import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Form, Input } from 'antd'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { errorMessage } from '@/api'
import PageSpinner from '@/components/common/PageSpinner'
import PageLayout from '@/components/layout/PageLayout'
import { ROUTES } from '@/config/routes'
import { useLogin, useMe } from '@/hooks/queries/auth'
import type { LoginRedirectState } from '@/router/RequireAdmin'
import type { LoginRequest } from '@/types'

export default function LoginPage() {
  const me = useMe()
  const login = useLogin()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm<LoginRequest>()
  const redirectTo = (location.state as LoginRedirectState | null)?.from ?? ROUTES.admin.dashboard

  if (me.isPending) return <PageSpinner />
  if (me.data) return <Navigate to={redirectTo} replace />

  const handleFinish = (values: LoginRequest) =>
    login.mutate(
      { email: values.email.trim(), password: values.password },
      { onSuccess: () => navigate(redirectTo, { replace: true }) },
    )

  return (
    <PageLayout
      tall
      title="Admin Sign In"
      description="View feedback and certificates from the StableNet training."
    >
      <Card>
        <Form<LoginRequest>
          form={form}
          layout="vertical"
          size="large"
          requiredMark={false}
          onFinish={handleFinish}
          onValuesChange={() => login.isError && login.reset()}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Enter your email.' },
              { type: 'email', message: 'Enter a valid email address.' },
            ]}
          >
            <Input size="small" prefix={<MailOutlined />} autoComplete="username" autoFocus />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Enter your password.' }]}>
            <Input.Password size="small" prefix={<LockOutlined />} autoComplete="current-password" />
          </Form.Item>
          {login.isError && <Alert type="error" showIcon className="mb-4" title={errorMessage(login.error)} />}
          <Button type="primary" htmlType="submit" block loading={login.isPending}>
            Sign in
          </Button>
        </Form>
      </Card>
    </PageLayout>
  )
}
