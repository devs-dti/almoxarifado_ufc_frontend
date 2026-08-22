'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export function AuthInit() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const currentUser = useAuthStore.getState().user
    if (!currentUser) return

    useAuthStore.getState().fetchMe().catch(() => {
      // Sessão inválida — logout tratado pelo interceptor 401
    })
  }, [])

  return null
}
