import { httpClient } from '../client'
import { useAuthStore } from '@/store/useAuthStore'

type FailedRequest = {
  resolve: () => void
  reject: (err: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

function processQueue(error: unknown) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()))
  failedQueue = []
}

export function setupAuthInterceptors() {
  // No request interceptor needed — browser sends httpOnly accessCookie automatically
  // via withCredentials: true on the axios instance

  httpClient.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config as typeof error.config & { _retry?: boolean }
      const isAuthRoute = original.url?.includes('/auth/')
      if (error.response?.status !== 401 || original._retry || isAuthRoute) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => httpClient(original))
      }

      original._retry = true
      isRefreshing = true

      try {
        // Backend sets new accessCookie via Set-Cookie header
        await httpClient.post('/auth/refresh-token')
        processQueue(null)
        return httpClient(original)
      } catch (err) {
        processQueue(err)
        useAuthStore.getState().logout()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
  )
}
