import { App, Button, Card, Form, Input } from 'antd'
import { errorMessage } from '@/api'
import { PASSWORD_MIN_LENGTH } from '@/config/constants'
import { useChangePassword } from '@/hooks/queries/auth'
import type { ChangePasswordRequest } from '@/types'

type Values = ChangePasswordRequest & { confirmPassword: string }

export default function ChangePasswordForm() {
  const [form] = Form.useForm<Values>()
  const { message } = App.useApp()
  const change = useChangePassword()

  const handleFinish = ({ currentPassword, newPassword }: Values) =>
    change.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          form.resetFields()
          message.success('Password changed. Other sessions have been signed out.')
        },
        onError: (error) => message.error(errorMessage(error)),
      },
    )

  return (
    <Card title="Change password">
      <Form<Values> form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
        <Form.Item
          name="currentPassword"
          label="Current password"
          rules={[{ required: true, message: 'Enter your current password.' }]}
        >
          <Input.Password size="small" autoComplete="current-password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New password"
          extra={`At least ${PASSWORD_MIN_LENGTH} characters. Signing in elsewhere will require it.`}
          rules={[
            { required: true, message: 'Enter a new password.' },
            { min: PASSWORD_MIN_LENGTH, message: `Use at least ${PASSWORD_MIN_LENGTH} characters.` },
          ]}
        >
          <Input.Password size="small" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm new password"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Repeat the new password.' },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                !value || value === getFieldValue('newPassword')
                  ? Promise.resolve()
                  : Promise.reject(new Error('The passwords don’t match.')),
            }),
          ]}
        >
          <Input.Password size="small" autoComplete="new-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={change.isPending}>
          Change password
        </Button>
      </Form>
    </Card>
  )
}
