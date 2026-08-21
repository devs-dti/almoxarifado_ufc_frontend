'use client'

import { LoginForm } from './LoginForm'

export function AuthCard() {
  return (
    <div className="bg-auth-card rounded-2xl p-6 w-full max-w-[320px] shadow-2xl">
      <h2 className="text-white font-bold text-lg mb-6">Login</h2>
      <LoginForm />
    </div>
  )
}
