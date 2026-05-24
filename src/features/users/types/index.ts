import type { Role } from '@/features/auth/types'

export type { Role }

export type UserListItem = {
  id: number
  name: string
  email: string
  role: Role
  deletedAt?: string | null
}

export type CreateUserPayload = {
  name: string
  email: string
  password: string
  role: Role
}

export type UpdateUserPayload = {
  name?: string
  email?: string
  role?: Role
}
