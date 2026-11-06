import { DeleteOutlined } from '@ant-design/icons'
import { App, Button, Card, Popconfirm, Skeleton } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiError, errorMessage } from '@/api'
import QueryState from '@/components/common/QueryState'
import AdminPageHeader from '@/components/layout/AdminPageHeader'
import { ROUTES } from '@/config/routes'
import {
  AnswersCard,
  ApprovalTag,
  CertificatePanel,
  ConsentTag,
  DownloadHistoryCard,
  DownloadStatusTag,
  ParticipantCard,
  ReviewButtons,
  UpdateRequestCard,
} from '@/features/admin'
import { useDeleteResponse, useResponse } from '@/hooks/queries/admin'
import { useCertificateSettings, useFormConfig } from '@/hooks/queries/public'
import NotFoundPage from '@/pages/NotFoundPage'
import type { FormConfig, ResponseDetail } from '@/types'

const BACK = { path: ROUTES.admin.responses, label: 'All responses' }

function Detail({ response, config }: { response: ResponseDetail; config: FormConfig }) {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const { settings } = useCertificateSettings()
  const remove = useDeleteResponse()

  const handleDelete = () =>
    remove.mutate(response.certId, {
      onSuccess: () => {
        message.success(`Deleted the response from ${response.name}`)
        navigate(ROUTES.admin.responses, { replace: true })
      },
      onError: (error) => message.error(errorMessage(error)),
    })

  return (
    <>
      <AdminPageHeader
        backTo={BACK}
        title={response.name}
        description={response.opco}
        extra={
          <>
            <ApprovalTag status={response.status} autoApproved={response.autoApproved} reason={response.rejectionReason} />
            <ConsentTag value={response.consent} />
            {response.status === 'approved' && <DownloadStatusTag count={response.participantDownloads} />}
            <ReviewButtons response={response} />
            <Popconfirm
              title="Delete this response?"
              description="Its certificate will no longer verify. This can’t be undone."
              okText="Delete"
              okButtonProps={{ danger: true, loading: remove.isPending }}
              onConfirm={handleDelete}
            >
              <Button danger size="small" icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </>
        }
      />

      {response.updateRequest && (
        <div className="mb-4">
          <UpdateRequestCard response={response} config={config} />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <ParticipantCard response={response} />
          <AnswersCard answers={response.answers} config={config} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <Card title="Certificate">
            <CertificatePanel response={response} settings={settings} />
          </Card>
          <DownloadHistoryCard downloads={response.downloads} />
        </div>
      </div>
    </>
  )
}

export default function ResponseDetailPage() {
  const { certId } = useParams<{ certId: string }>()
  const response = useResponse(certId)
  const config = useFormConfig()

  if (response.error instanceof ApiError && response.error.status === 404) {
    return (
      <NotFoundPage
        title="Response not found"
        subTitle={`No response with certificate ID “${certId ?? ''}”.`}
        backTo={BACK}
      />
    )
  }

  return (
    <QueryState query={response} loading={<Skeleton active paragraph={{ rows: 12 }} />}>
      {(data) => <QueryState query={config}>{(c) => <Detail response={data} config={c} />}</QueryState>}
    </QueryState>
  )
}
