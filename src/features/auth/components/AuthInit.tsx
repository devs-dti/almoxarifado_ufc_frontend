'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export function AuthInit() {
  const { user, fetchMe } = useAuthStore()

  useEffect(() => {
    if (!user) return
    fetchMe().catch(() => {
      // token invalid — logout handled by interceptor 401 flow
    })
  }, [])

  return null
}
