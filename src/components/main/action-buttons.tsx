'use client'

import { useRouter } from 'next/navigation'
import CardButton from './card_button'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

export function ActionButtons() {
  const router = useRouter()
  return (
    <div className="flex w-full justify-center gap-4 p-4">
      <CardButton icon={FaArrowDown} title="Entradas" onClick={() => router.push('/dashboard/entradas')} />
      <CardButton icon={FaArrowUp} title="Saídas" onClick={() => router.push('/dashboard/transferencias')} />
    </div>
  )
}
