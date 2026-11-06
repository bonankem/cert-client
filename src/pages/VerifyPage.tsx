import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Card, Descriptions, Input, Result, Skeleton } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { errorMessage } from '@/api'
import PageLayout from '@/components/layout/PageLayout'
import { COURSE, ORGANISATION } from '@/config/constants'
import { ROUTES } from '@/config/routes'
import { useVerifyPublic } from '@/hooks/queries/public'
import { formatLongDate } from '@/utils/date'

function VerificationResult({ code }: { code: string }) {
  const verify = useVerifyPublic(code)

  if (verify.isPending) return <Skeleton active paragraph={{ rows: 4 }} />
  if (verify.isError) return <Result status="warning" title="Couldn’t check this certificate" subTitle={errorMessage(verify.error)} />

  const match = verify.data.match
  if (!match) {
    return (
      <Result
        icon={<CloseCircleFilled className="text-red-500!" />}
        title="Not a valid certificate"
        subTitle={`No ${ORGANISATION.name} certificate matches “${code}”. Check the code and try again.`}
      />
    )
  }

  return (
    <Result
      icon={<CheckCircleFilled className="text-leaf!" />}
      title="Valid certificate"
      subTitle={`Issued by ${ORGANISATION.legalName} for the ${COURSE.title}.`}
      extra={
        <Descriptions
          bordered
          column={1}
          size="small"
          className="mx-auto max-w-md text-left"
          items={[
            { key: 'name', label: 'Awarded to', children: <strong>{match.name}</strong> },
            { key: 'opco', label: 'OpCo', children: match.opco },
            { key: 'date', label: 'Date of issue', children: formatLongDate(match.submittedAt) },
            { key: 'id', label: 'Certificate ID', children: <span className="font-mono">{match.certId}</span> },
            { key: 'code', label: 'Verification code', children: <span className="font-mono">{match.verificationCode}</span> },
          ]}
        />
      }
    />
  )
}

/** Public page opened by the QR code on each certificate (or by typing a code). */
export default function VerifyPage() {
  const { code } = useParams<{ code?: string }>()
  const navigate = useNavigate()

  return (
    <PageLayout
      title="Certificate"
      titleAccent="Verification"
      description="Confirm that a StableNet training certificate was issued by Zoracom. Scan the QR code on the certificate, or enter its verification code or certificate ID."
    >
      <Card>
        <Input.Search
          key={code ?? ''}
          defaultValue={code}
          size="small"
          placeholder="e.g. 7KQ2-M9XA-T4PZ or ZC-STN-261105-K7Q2"
          enterButton="Verify"
          maxLength={40}
          allowClear
          onSearch={(value) => value.trim() && navigate(ROUTES.verify(value.trim().toUpperCase()))}
        />
        {code && (
          <div className="mt-4">
            <VerificationResult code={code} />
          </div>
        )}
      </Card>
    </PageLayout>
  )
}
