'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
      <AlertTriangle size={40} className="text-amber-400" />
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-800">Algo deu errado</h2>
        <p className="text-sm text-gray-400 max-w-xs">
          Ocorreu um erro inesperado. Tente novamente ou contate o suporte.
        </p>
      </div>
      <Button onClick={reset} className="max-w-[160px] rounded-xl">
        Tentar novamente
      </Button>
    </div>
  )
}
