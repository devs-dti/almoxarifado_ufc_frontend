import { httpClient } from '../client'
import { useAuthStore } from '@/store/useAuthStore'

type FailedRequest = {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

export function setupAuthInterceptors() {
  httpClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  httpClient.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config as typeof error.config & { _retry?: boolean }
      if (error.response?.status !== 401 || original._retry || original.url?.includes('/auth/login')) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return httpClient(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await httpClient.post<{ token: string }>('/auth/refresh-token')
        const store = useAuthStore.getState()
        store.setAuth(data.token, store.user)
        processQueue(null, data.token)
        original.headers.Authorization = `Bearer ${data.token}`
        return httpClient(original)
      } catch (err) {
        processQueue(err, null)
        useAuthStore.getState().logout()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
  )
}
