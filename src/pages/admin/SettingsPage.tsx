import QueryState from '@/components/common/QueryState'
import AdminPageHeader from '@/components/layout/AdminPageHeader'
import { CertificateSettingsForm, NotificationEmailsCard } from '@/features/admin'
import { useCertificateSettings } from '@/hooks/queries/public'

export default function SettingsPage() {
  const settings = useCertificateSettings()

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <AdminPageHeader
        title="Settings"
        description="Certificate details shown on every participant’s certificate, and who gets admin notifications. Set this up before you share the feedback link."
      />
      <QueryState query={settings}>
        {(data) => <CertificateSettingsForm settings={data} />}
      </QueryState>
      <NotificationEmailsCard />
    </div>
  )
}
