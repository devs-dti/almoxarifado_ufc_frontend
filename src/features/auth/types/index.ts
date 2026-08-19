import type { EntityId } from '@/shared/types/id'

export type Role = 'ADMIN' | 'MANAGER' | 'STAFF'

export type User = {
  id: EntityId
  name: string
  email: string
  role: Role
  jobTitle?: string
  imageUrl?: string | null
  enabled?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export type AuthResponse = {
  token: string
  refreshToken?: string
  user: User
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  role: Role
}

export type ForgotPasswordPayload = {
  email: string
}

export type ResetPasswordPayload = {
  password: string
  confirmPassword: string
}
