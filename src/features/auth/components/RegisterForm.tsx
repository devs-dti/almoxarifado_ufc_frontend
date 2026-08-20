'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/shared/components/PasswordInput'
import { parseApiError } from '@/shared/lib/parseApiError'
import { usersApi } from '@/features/users/api'
import { registerSchema } from '../schemas'
import { AUTH_INPUT_CLASS } from '../constants'

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  async function onSubmit(data: RegisterFormData) {
    try {
      await usersApi.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'STAFF',
        cpf: '00000000000',
        jobTitle: 'Funcionário',
        sectorId: '',
      })
      toast.success('Conta criada! Faça login para continuar.')
      form.reset()
    } catch {
      // O erro já é tratado globalmente pelo interceptor do Axios em client.ts
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 text-sm">Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Seu nome completo" className={AUTH_INPUT_CLASS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormLabel className="text-gray-300 text-sm">Confirme a senha</FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="Repita a senha" className={AUTH_INPUT_CLASS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} className="mt-1">
          {form.formState.isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
    </Form>
  )
}
