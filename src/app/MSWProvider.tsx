'use client'

import { useEffect, useState } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ? 'loading' : 'ready'
  )

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCKS !== 'true') return
    let active = true
    import('@/infrastructure/mocks/browser')
      .then(({ worker }) => worker.start({ onUnhandledRequest: 'warn', serviceWorker: { url: '/mockServiceWorker.js' } }))
      .then(() => { if (active) setStatus('ready') })
      .catch((error) => {
        console.error('Não foi possível iniciar os mocks:', error)
        if (active) setStatus('error')
      })
    return () => { active = false }
  }, [])

  if (status === 'loading') return <div role="status" className="min-h-screen grid place-items-center text-slate-600">Preparando ambiente de demonstração...</div>
  if (status === 'error') return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <div role="alert" className="max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-xl font-bold text-slate-900">Não foi possível iniciar a demonstração</h1>
        <p className="mt-3 text-sm text-slate-600">Confira se o navegador permite service workers e recarregue a página.</p>
        <button className="mt-5 rounded-lg bg-violet-700 px-4 py-2 text-white" onClick={() => window.location.reload()}>Recarregar página</button>
      </div>
    </main>
  )
  return <>{children}</>
}
