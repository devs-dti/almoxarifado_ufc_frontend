'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { PasswordInput } from '@/shared/components/PasswordInput'
import { useAuthStore } from '@/store/useAuthStore'
import { loginSchema } from '../schemas'
import { AUTH_INPUT_CLASS } from '../constants'
import type { LoginPayload } from '../types'

const REMEMBER_KEY = 'almox_remember_email'

export function LoginForm() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const [rememberMe, setRememberMe] = useState(false)

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // Ao montar, recupera o email salvo do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY)
    if (saved) {
      form.setValue('email', saved)
      setRememberMe(true)
    }
  }, [form])

  async function onSubmit(data: LoginPayload) {
    try {
      // Salva ou remove o email do localStorage conforme o checkbox
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, data.email)
      } else {
        localStorage.removeItem(REMEMBER_KEY)
      }

      await login(data)
      toast.success('Login bem-sucedido!')
      router.push('/dashboard')
    } catch {
      // O erro já é tratado globalmente pelo interceptor do Axios em client.ts
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 text-sm">E-mail</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="seu@email.com" className={AUTH_INPUT_CLASS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 text-sm">Senha</FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="••••••••" className={AUTH_INPUT_CLASS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(v) => setRememberMe(v === true)}
              className="border-gray-500 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
            />
            <span className="text-xs text-gray-400">Lembrar meu e-mail</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-brand hover:text-brand-hover underline-offset-2 hover:underline"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting} className="mt-1">
          {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </Form>
  )
}
