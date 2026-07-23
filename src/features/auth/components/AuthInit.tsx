'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export function AuthInit() {
  const { fetchMe } = useAuthStore()

  useEffect(() => {
    fetchMe()
  }, [])

  return null
}
