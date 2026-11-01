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
import { parseApiError } from '@/shared/lib/parseApiError'

const INPUT_CLASS = 'h-12 rounded-xl border-slate-300 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-600'
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
    } catch (error) {
      toast.error(parseApiError(error, 'Não foi possível entrar. Confira seus dados e tente novamente.'))
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
              <FormLabel className="text-slate-700 text-sm font-medium">E-mail</FormLabel>
              <FormControl>
                <Input {...field} type="email" autoComplete="email" placeholder="seu@email.com" className={INPUT_CLASS} />
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
              <FormLabel className="text-slate-700 text-sm font-medium">Senha</FormLabel>
              <FormControl>
                <PasswordInput {...field} autoComplete="current-password" placeholder="••••••••" className={INPUT_CLASS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(v) => setRememberMe(v === true)}
              className="border-slate-400 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
            />
            <span className="text-xs text-slate-600">Lembrar meu e-mail</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-violet-700 hover:text-violet-900 underline-offset-2 hover:underline"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting} className="mt-2 h-12 w-full rounded-xl bg-violet-700 font-semibold text-white hover:bg-violet-800">
          {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </Form>
  )
}
