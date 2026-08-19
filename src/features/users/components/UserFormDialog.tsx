'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/shared/components/PasswordInput'
import { useCreateUser, useUpdateUser } from '../hooks'
import type { UserListItem } from '../types'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  STAFF: 'Colaborador',
}

const userFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']),
})

type UserFormData = z.infer<typeof userFormSchema>

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing?: UserListItem | null
}

export function UserFormDialog({ open, onOpenChange, editing }: Props) {
  const create = useCreateUser()
  const update = useUpdateUser()

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: '', email: '', password: '', role: 'STAFF' },
  })

  useEffect(() => {
    form.reset(
      editing
        ? { name: editing.name, email: editing.email, password: '', role: editing.role }
        : { name: '', email: '', password: '', role: 'STAFF' }
    )
  }, [editing, open])

  async function onSubmit(data: UserFormData) {
    try {
      if (editing) {
        await update.mutateAsync({
          id: editing.id,
          data: { name: data.name, email: data.email, role: data.role },
        })
        toast.success('Usuário atualizado!')
      } else {
        if (!data.password) {
          form.setError('password', { message: 'Senha é obrigatória' })
          return
        }
        await create.mutateAsync({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        })
        toast.success('Usuário cadastrado!')
      }
      onOpenChange(false)
    } catch {
      toast.error('Erro ao salvar usuário.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl><Input type="email" className="rounded-xl" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!editing && (
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl><PasswordInput className="rounded-xl" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}
            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={create.isPending || update.isPending}>
                {(create.isPending || update.isPending) ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
