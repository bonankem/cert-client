import AdminPageHeader from '@/components/layout/AdminPageHeader'
import { VerifyCertificateForm } from '@/features/admin'

export default function VerifyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <AdminPageHeader title="Verify a certificate" description="Confirm a certificate was issued through this form." />
      <VerifyCertificateForm />
    </div>
  )
}
