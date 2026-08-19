'use client'

import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

type Tab = 'login' | 'register'

const TABS: { key: Tab; label: string }[] = [
  { key: 'login', label: 'Login' },
  { key: 'register', label: 'Registrar-se' },
]

export function AuthCard() {
  const [tab, setTab] = useState<Tab>('login')

  return (
    <div className="bg-auth-card rounded-2xl p-6 w-full max-w-[320px] shadow-2xl">
      <div className="flex gap-6 mb-6 border-b border-auth-input pb-3">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`text-sm pb-1 transition-colors ${
              tab === key
                ? 'font-bold text-white border-b-2 border-brand -mb-[13px]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-200">
        {tab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  )
}
