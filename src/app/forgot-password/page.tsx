import { AuthShell } from '@/shared/components/AuthShell'
import { ForgotPasswordCard } from '@/features/auth/components/ForgotPasswordCard'

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordCard />
    </AuthShell>
  )
}
