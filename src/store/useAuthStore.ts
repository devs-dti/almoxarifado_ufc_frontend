import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { httpClient } from '@/infrastructure/http/client'
import type { User, LoginPayload } from '@/features/auth/types'

type AuthState = {
  user: User | null
  loading: boolean
  setAuth: (user: User | null) => void
  login: (data: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: () => boolean
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,

      setAuth: (user) => {
        set({ user })
      },

      login: async (data: LoginPayload) => {
        set({ loading: true })
        try {
          const res = await httpClient.post<User>('/auth/login', data)
          const user = res.data
          set({ user, loading: false })
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      logout: async () => {
        try {
          await httpClient.post('/auth/logout')
        } catch {
          // Cookie pode já ter expirado — ignora o erro
        }
        set({ user: null, loading: false })
        if (typeof window !== 'undefined') window.location.href = '/login'
      },

      isAuthenticated: () => Boolean(get().user),

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
      partialize: (state) => ({ user: state.user }),
    }
  )
)
