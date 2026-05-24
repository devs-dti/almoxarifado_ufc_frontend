'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = useState(false)
    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type={show ? 'text' : 'password'}
          className={cn('pr-10', className)}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
          aria-label={show ? 'Esconder senha' : 'Mostrar senha'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'
