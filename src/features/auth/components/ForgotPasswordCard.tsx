'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { parseApiError } from '@/shared/lib/parseApiError'
import { authApi } from '@/features/auth/api'
import { forgotPasswordSchema } from '@/features/auth/schemas'
const INPUT_CLASS = 'h-12 rounded-xl border-slate-300 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-600'
import type { ForgotPasswordPayload } from '@/features/auth/types'

export function ForgotPasswordCard() {
  const form = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: ForgotPasswordPayload) {
    try {
      await authApi.forgotPassword(data)
      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.')
      form.reset()
    } catch (err) {
      toast.error(parseApiError(err, 'Erro ao enviar email. Tente novamente.'))
    }
  }

  return (
    <div className="w-full max-w-md">
      <Link
        href="/login"
        className="flex items-center gap-2 text-slate-600 hover:text-violet-700 text-sm font-medium mb-10 w-fit"
      >
        <ArrowLeft size={14} />
        Voltar para o login
      </Link>

      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">Recuperação de acesso</p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Esqueceu sua senha?</h1>
      <p className="mt-3 mb-8 text-sm leading-6 text-slate-600">
        Informe seu e-mail e enviaremos um link para redefinir sua senha.
      </p>

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

          <Button type="submit" disabled={form.formState.isSubmitting} className="mt-2 h-12 w-full rounded-xl bg-violet-700 font-semibold text-white hover:bg-violet-800">
            {form.formState.isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
