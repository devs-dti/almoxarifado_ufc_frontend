import type { Role } from '@/features/auth/types'

export type ReportNotificationType = 'EXPIRATION' | 'LOW_STOCK'

export type ReportRecipient = {
  id: string
  name: string
  email: string | null
  role: Role | null
  eligible: boolean
}

export type ReportNotificationSettings = {
  type: ReportNotificationType
  enabled: boolean
  recipients: ReportRecipient[]
}

export type ReportNotificationUpdate = {
  enabled: boolean
  recipientIds: string[]
}
