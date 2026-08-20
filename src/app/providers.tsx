'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { queryClient } from '@/shared/lib/query-client'
import { setupAuthInterceptors } from '@/infrastructure/http/interceptors/auth.interceptor'
import { MSWProvider } from './MSWProvider'
import { AuthInit } from '@/features/auth/components/AuthInit'

setupAuthInterceptors()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <QueryClientProvider client={queryClient}>
        <AuthInit />
        {children}
        <Toaster position="top-center" richColors closeButton duration={3000} />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </MSWProvider>
  )
}
