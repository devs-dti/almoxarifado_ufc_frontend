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
  httpClient.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config as typeof error.config & { _retry?: boolean }
      
      // Apenas intercepta 401 que não sejam do próprio refresh ou do login
      if (
        error.response?.status !== 401 || 
        original._retry || 
        original.url?.includes('/auth/login') ||
        original.url?.includes('/auth/refresh-token')
      ) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => {
          return httpClient(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        await httpClient.post('/auth/refresh-token')
        // O backend envia um novo accessCookie, basta re-tentar a request
        processQueue(null)
        return httpClient(original)
      } catch (err) {
        processQueue(err)
        useAuthStore.getState().logout()
        // Adicione apenas esta linha para evitar que a tela fique congelada:
      if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
  )
}
