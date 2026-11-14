'use client'

import { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { SidebarContent } from './sidebar'

type MenuProps = { className?: string }

export default function Menu({ className }: MenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('relative flex flex-row lg:hidden', className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Abrir menu"
            className={`flex h-10 w-10 items-center justify-center rounded transition-colors duration-100${open ? ' bg-brand/10' : ''}`}
          >
            <FaBars className="text-gray-600" />
          </button>
        </SheetTrigger>
        
        <SheetContent side="left" overlayClassName="mobile-menu-overlay" className="mobile-menu-panel w-64 p-0 flex flex-col bg-white border-r-0">
          <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
          <SidebarContent onLinkClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
