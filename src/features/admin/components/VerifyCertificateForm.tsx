import { Alert, Button, Card, Input, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { errorMessage } from '@/api'
import { ROUTES } from '@/config/routes'
import { useVerifyCertificate } from '@/hooks/queries/admin'
import { formatLongDate } from '@/utils/date'

function VerifyResultAlert({ verify }: { verify: ReturnType<typeof useVerifyCertificate> }) {
  if (verify.isError) return <Alert type="error" showIcon title={errorMessage(verify.error)} />
  if (!verify.isSuccess) return null

  const match = verify.data.match
  if (!match) return <Alert type="error" showIcon title="No certificate found with that ID or code." />

  return (
    <Alert
      type="success"
      showIcon
      title={`Valid — issued to ${match.name} (${match.opco})`}
      description={`Issued ${formatLongDate(match.submittedAt)}. Certificate ID ${match.certId}, verification code ${match.verificationCode}.`}
      action={
        <Link to={ROUTES.admin.response(match.certId)}>
          <Button size="small">Open</Button>
        </Link>
      }
    />
  )
}

export default function VerifyCertificateForm() {
  const verify = useVerifyCertificate()

  return (
    <Card>
      <Typography.Paragraph type="secondary">
        Enter a certificate ID or the verification code printed on the certificate (also in its QR code).
      </Typography.Paragraph>
      <Input.Search
        size="small"
        placeholder="e.g. ZC-STN-261105-K7Q2 or 7KQ2-M9XA-T4PZ"
        enterButton="Verify"
        allowClear
        maxLength={40}
        loading={verify.isPending}
        onSearch={(value) => (value.trim() ? verify.mutate(value.trim()) : verify.reset())}
        onChange={() => verify.reset()}
      />
      <div className="mt-3">
        <VerifyResultAlert verify={verify} />
      </div>
    </Card>
  )
}
