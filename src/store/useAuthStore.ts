import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { httpClient } from '@/infrastructure/http/client'
import type { User, LoginPayload } from '@/features/auth/types'

type AuthState = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
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

      setUser: (user) => set({ user }),

      login: async (data: LoginPayload) => {
        set({ loading: true })
        try {
          // Backend returns User in body and sets httpOnly cookies (accessCookie/refreshCookie)
          const res = await httpClient.post<User>('/auth/login', data)
          set({ user: res.data, loading: false })
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      logout: async () => {
        try {
          await httpClient.post('/auth/logout')
        } catch {
          // clear local state regardless
        }
        set({ user: null, loading: false })
      },

      isAuthenticated: () => Boolean(get().user),

      fetchMe: async () => {
        set({ loading: true })
        try {
          const res = await httpClient.get<User>('/auth/me')
          set({ user: res.data, loading: false })
        } catch {
          set({ user: null, loading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
