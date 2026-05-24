'use client'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { AuthPageWrapper } from '@/shared/components/AuthPageWrapper'
import { PasswordInput } from '@/shared/components/PasswordInput'
import { parseApiError } from '@/shared/lib/parseApiError'
import { authApi } from '@/features/auth/api'
import { resetPasswordSchema } from '@/features/auth/schemas'
import { AUTH_INPUT_CLASS } from '@/features/auth/constants'
import type { ResetPasswordPayload } from '@/features/auth/types'

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()

  const form = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(data: ResetPasswordPayload) {
    try {
      await authApi.resetPassword(token, data)
      toast.success('Senha redefinida com sucesso!')
      router.push('/login')
    } catch (err) {
      toast.error(parseApiError(err, 'Token inválido ou expirado.'))
    }
  }

  return (
    <AuthPageWrapper>
      <div className="bg-auth-card rounded-2xl p-6 w-full max-w-[320px] shadow-2xl">
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

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Salvando...' : 'Redefinir senha'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthPageWrapper>
  )
}
