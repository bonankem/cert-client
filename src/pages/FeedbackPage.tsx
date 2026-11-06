import { MailOutlined } from '@ant-design/icons'
import { App } from 'antd'
import { useNavigate } from 'react-router-dom'
import CertificateModal from '@/components/certificate/CertificateModal'
import CertificateArt from '@/components/layout/hero/CertificateArt'
import PageLayout from '@/components/layout/PageLayout'
import { ROUTES } from '@/config/routes'
import { FeedbackForm, ReturningBanner } from '@/features/feedback'
import { useCertificateDialog } from '@/hooks/useCertificateDialog'
import { useWebStore } from '@/hooks/useWebStore'
import { mySubmissionStore, readMySubmission, rememberSubmission } from '@/services/mySubmission'
import type { SubmitResult } from '@/types'

/** Shown when the email already has a submission: no new certificate, the link goes by email. */
const REPEAT_MESSAGES: Record<Exclude<SubmitResult['outcome'], 'created'>, { title: string; text: string }> = {
  update_requested: {
    title: 'Update request sent',
    text: 'You already have a certificate for this email address, so we didn’t create a second one. Your changes were sent to the training team for approval, and your current certificate stays valid until then. We’ve emailed you a link to check the status.',
  },
  resubmitted: {
    title: 'Submission updated',
    text: 'We already had a submission for this email address, so we replaced it with this one. It’s waiting for approval by the training team. We’ve emailed you a link to check the status.',
  },
}

export default function FeedbackPage() {
  const mine = readMySubmission(useWebStore(mySubmissionStore))
  const dialog = useCertificateDialog()
  const navigate = useNavigate()
  const { modal } = App.useApp()

  const handleSubmitted = ({ outcome, submission }: SubmitResult) => {
    if (outcome !== 'created' || !submission) {
      const message = REPEAT_MESSAGES[outcome === 'created' ? 'resubmitted' : outcome]
      modal.info({ title: message.title, content: message.text, icon: <MailOutlined className="text-[#0072ce]!" />, okText: 'Got it' })
      return
    }
    rememberSubmission(submission)
    // On the participant list: approved instantly, so show the certificate right away.
    if (submission.status === 'approved' && submission.certificate) {
      dialog.show(submission.certificate, { variant: 'submitted' })
    } else {
      navigate(ROUTES.certificateStatus(submission.accessToken))
    }
  }

  const banner =
    mine &&
    (mine.accessToken ? (
      <ReturningBanner
        name={mine.name}
        actionLabel="Check my certificate"
        onAction={() => navigate(ROUTES.certificateStatus(mine.accessToken!))}
      />
    ) : mine.certificate ? (
      <ReturningBanner
        name={mine.name}
        actionLabel="View my certificate"
        onAction={() => dialog.show(mine.certificate!, { variant: 'returning' })}
      />
    ) : null)

  return (
    <PageLayout
      title="StableNet Training"
      titleAccent="Feedback"
      description="Thank you for taking part in the 5-day StableNet training. This takes about two minutes. Once the training team approves your submission, we’ll email you your certificate."
      aside={<CertificateArt className="w-full" />}
      footer={banner}
    >
      <FeedbackForm onSubmitted={handleSubmitted} />
      <CertificateModal dialog={dialog} />
    </PageLayout>
  )
}
