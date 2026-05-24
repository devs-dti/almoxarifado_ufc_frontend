'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AuthPageWrapper } from '@/shared/components/AuthPageWrapper'
import { parseApiError } from '@/shared/lib/parseApiError'
import { authApi } from '@/features/auth/api'
import { forgotPasswordSchema } from '@/features/auth/schemas'
import { AUTH_INPUT_CLASS } from '@/features/auth/constants'
import type { ForgotPasswordPayload } from '@/features/auth/types'

export default function ForgotPasswordPage() {
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
    <AuthPageWrapper>
      <div className="bg-auth-card rounded-2xl p-6 w-full max-w-[320px] shadow-2xl">
        <Link
          href="/login"
          className="flex items-center gap-1 text-gray-400 hover:text-gray-200 text-sm mb-5 w-fit"
        >
          <ArrowLeft size={14} />
          Voltar
        </Link>

        <h1 className="text-white text-xl font-bold mb-1">Esqueceu sua senha?</h1>
        <p className="text-gray-400 text-sm mb-5">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

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

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthPageWrapper>
  )
}
