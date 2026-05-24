'use client'

import { useRef } from 'react'
import { useToggle } from 'usehooks-ts'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { FaBars } from 'react-icons/fa'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

type MenuProps = { className?: string }

export default function Menu({ className }: MenuProps) {
  const [open, toggleOpen, setOpen] = useToggle(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { logout } = useAuthStore()
  const router = useRouter()

  async function handleLogout() {
    setOpen(false)
    await logout()
    router.push('/login')
  }

  return (
    <div ref={menuRef} className={cn('relative flex flex-row', className)}>
      <button
        onClick={() => toggleOpen()}
        aria-label="Abrir menu"
        className={`flex h-10 w-10 items-center justify-center rounded transition-colors duration-100${open ? ' bg-brand/10' : ''}`}
      >
        <FaBars className="text-gray-600" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 right-0 mt-12 w-40 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  )
}
