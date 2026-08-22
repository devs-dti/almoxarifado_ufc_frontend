import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { authApi } from '../api'
import { useAuthStore } from '@/store/useAuthStore'
import type { User } from '../types'

export const authKeys = {
  all: ['auth'] as const,
  me: () => ['auth', 'me'] as const,
}

export function useProfile() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const storeUser = useAuthStore((s) => s.user)

  const query = useQuery<User>({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    initialData: storeUser ?? undefined,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  useEffect(() => {
    if (query.data) {
      setAuth(query.data)
    }
  }, [query.data, setAuth])

  return query
}
