'use client'

import { Suspense } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/shared/components/PasswordInput'
import { parseApiError } from '@/shared/lib/parseApiError'
import { authApi } from '@/features/auth/api'
import { resetPasswordSchema } from '@/features/auth/schemas'
import { AUTH_INPUT_CLASS } from '@/features/auth/constants'
import type { ResetPasswordPayload } from '@/features/auth/types'

interface ResetPasswordCardProps {
  token?: string
}

function ResetPasswordCardContent({ token: propToken }: ResetPasswordCardProps) {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Suporta token passado via prop, via rota dinamica (/reset-password/[token]) ou via query param (/reset-password?token=...)
  const pathToken = typeof params?.token === 'string' ? params.token : ''
  const queryToken = searchParams?.get('token') || ''
  const resolvedToken = propToken || pathToken || queryToken

  const form = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(data: ResetPasswordPayload) {
    if (!resolvedToken) {
      toast.error('Token de recuperação não encontrado.')
      return
    }

    try {
      await authApi.resetPassword(resolvedToken, data)
      toast.success('Senha redefinida com sucesso!')
      router.push('/login')
    } catch (err) {
      toast.error(parseApiError(err, 'Token inválido ou expirado.'))
    }
  }

  if (!resolvedToken) {
    return (
      <div className="bg-auth-card rounded-2xl p-6 w-full max-w-[320px] shadow-2xl text-center">
        <h1 className="text-white text-xl font-bold mb-2">Link Inválido</h1>
        <p className="text-gray-400 text-sm mb-6">
          O link de redefinição de senha não contém um token válido.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-medium transition-all"
        >
          Solicitar novo link
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-auth-card rounded-2xl p-6 w-full max-w-[320px] shadow-2xl">
      <Link
        href="/login"
        className="flex items-center gap-1 text-gray-400 hover:text-gray-200 text-sm mb-4 w-fit"
      >
        <ArrowLeft size={14} />
        Voltar para o login
      </Link>

      <h1 className="text-white text-xl font-bold mb-1">Redefinir senha</h1>
      <p className="text-gray-400 text-sm mb-5">Digite sua nova senha abaixo.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm">Nova senha</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder="Mínimo 8 caracteres" className={AUTH_INPUT_CLASS} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm">Confirme a nova senha</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder="Repita a senha" className={AUTH_INPUT_CLASS} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
            {form.formState.isSubmitting ? 'Salvando...' : 'Redefinir senha'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export function ResetPasswordCard({ token }: ResetPasswordCardProps) {
  return (
    <Suspense fallback={<div className="text-white text-sm">Carregando...</div>}>
      <ResetPasswordCardContent token={token} />
    </Suspense>
  )
}
