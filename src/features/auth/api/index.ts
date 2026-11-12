import { httpClient } from '@/infrastructure/http/client'
import type { AuthResponse, LoginPayload, ForgotPasswordPayload, ResetPasswordPayload } from '../types'

export const authApi = {
  login: (data: LoginPayload) =>
    httpClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  logout: () => httpClient.post('/auth/logout'),

  me: () => httpClient.get<AuthResponse>('/auth/me').then((r) => r.data),

  updateProfile: (data: FormData) =>
    httpClient.patch<AuthResponse>('/auth/me', data, { headers: { 'Content-Type': undefined } }).then((r) => r.data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    httpClient.patch('/auth/me/password', data),

  refreshToken: () =>
    httpClient.post<{ token: string }>('/auth/refresh-token').then((r) => r.data),

  forgotPassword: (data: ForgotPasswordPayload) =>
    httpClient.post('/auth/forgot-password', data),

  resetPassword: (token: string, data: ResetPasswordPayload) =>
    httpClient.post(`/auth/reset-password/${token}`, { newPassword: data.password }),
}
