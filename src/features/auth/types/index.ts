export type Role = 'ADMIN' | 'MANAGER' | 'STAFF'

export type User = {
  id: number
  name: string
  email: string
  role: Role
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
