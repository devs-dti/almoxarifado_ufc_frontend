import { AuthPageWrapper } from '@/shared/components/AuthPageWrapper'
import { ResetPasswordCard } from '@/features/auth/components/ResetPasswordCard'

export default function ResetPasswordWithTokenPage() {
  return (
    <AuthPageWrapper>
      <ResetPasswordCard />
    </AuthPageWrapper>
  )
}
