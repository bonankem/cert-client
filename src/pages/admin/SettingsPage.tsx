import QueryState from '@/components/common/QueryState'
import AdminPageHeader from '@/components/layout/AdminPageHeader'
import { CertificateSettingsForm } from '@/features/admin'
import { useCertificateSettings } from '@/hooks/queries/public'

export default function SettingsPage() {
  const settings = useCertificateSettings()

  return (
    <div className="mx-auto w-full max-w-4xl">
      <AdminPageHeader
        title="Certificate settings"
        description="Shown on every participant’s certificate. Set this up before you share the feedback link."
      />
      <QueryState query={settings}>
        {(data) => <CertificateSettingsForm settings={data} />}
      </QueryState>
    </div>
  )
}
