import { httpClient } from '@/infrastructure/http/client'
import type { AuthResponse, LoginPayload, ForgotPasswordPayload, ResetPasswordPayload } from '../types'

export const authApi = {
  login: (data: LoginPayload) =>
    httpClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  logout: () => httpClient.post('/auth/logout'),

  me: () => httpClient.get<AuthResponse['user']>('/auth/me').then((r) => r.data),

  refreshToken: () =>
    httpClient.post<{ token: string }>('/auth/refresh-token').then((r) => r.data),

  forgotPassword: (data: ForgotPasswordPayload) =>
    httpClient.post('/auth/forgot-password', data),

  resetPassword: (token: string, data: ResetPasswordPayload) =>
    httpClient.post(`/auth/reset-password/${token}`, data),
}
