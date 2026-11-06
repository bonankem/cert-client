import CertificateModal from '@/components/certificate/CertificateModal'
import CertificateArt from '@/components/layout/hero/CertificateArt'
import PageLayout from '@/components/layout/PageLayout'
import { FeedbackForm, ReturningBanner } from '@/features/feedback'
import { useCertificateDialog } from '@/hooks/useCertificateDialog'
import { useWebStore } from '@/hooks/useWebStore'
import { isValidSubmission, mySubmissionStore, rememberSubmission } from '@/services/mySubmission'

export default function FeedbackPage() {
  const stored = useWebStore(mySubmissionStore)
  const mySubmission = isValidSubmission(stored) ? stored : null
  const dialog = useCertificateDialog()

  return (
    <PageLayout
      title="StableNet Training"
      titleAccent="Feedback"
      description="Thank you for taking part in the 5-day StableNet training. This takes about two minutes, and you’ll get your certificate as soon as you submit."
      aside={<CertificateArt className="w-full" />}
      footer={
        mySubmission && (
          <ReturningBanner
            name={mySubmission.name}
            onView={() => dialog.show(mySubmission, { variant: 'returning' })}
          />
        )
      }
    >
      <FeedbackForm
        onSubmitted={(record) => {
          rememberSubmission(record)
          dialog.show(record, { variant: 'submitted' })
        }}
      />

      <CertificateModal dialog={dialog} />
    </PageLayout>
  )
}
