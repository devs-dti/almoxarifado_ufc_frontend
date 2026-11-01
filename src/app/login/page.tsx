import { AuthShell } from '@/shared/components/AuthShell'
import { AuthCard } from '@/features/auth/components/AuthCard'

export default function LoginPage() {
  return (
    <AuthShell>
      <AuthCard />
    </AuthShell>
  )
}
