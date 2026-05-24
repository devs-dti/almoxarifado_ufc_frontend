import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { httpClient } from '@/infrastructure/http/client'
import type { User, LoginPayload, AuthResponse } from '@/features/auth/types'

const AUTH_COOKIE = 'auth-token'

type AuthState = {
  token: string | null
  user: User | null
  loading: boolean
  setAuth: (token: string | null, user: User | null) => void
  login: (data: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: () => boolean
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,

      setAuth: (token, user) => {
        if (token) {
          Cookies.set(AUTH_COOKIE, token, { sameSite: 'strict' })
        } else {
          Cookies.remove(AUTH_COOKIE)
        }
        set({ token, user })
      },

      login: async (data: LoginPayload) => {
        set({ loading: true })
        try {
          const res = await httpClient.post<AuthResponse>('/auth/login', data)
          const { token, user } = res.data
          Cookies.set(AUTH_COOKIE, token, { sameSite: 'strict' })
          set({ token, user, loading: false })
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      logout: async () => {
        try {
          await httpClient.post('/auth/logout')
        } catch {
          // ignore — clear local state regardless
        }
        Cookies.remove(AUTH_COOKIE)
        set({ token: null, user: null, loading: false })
      },

      isAuthenticated: () => Boolean(get().token),

      fetchMe: async () => {
        set({ loading: true })
        try {
          const res = await httpClient.get<User>('/auth/me')
          set({ user: res.data, loading: false })
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          Cookies.set(AUTH_COOKIE, state.token, { sameSite: 'strict' })
        }
      },
    }
  )
)
