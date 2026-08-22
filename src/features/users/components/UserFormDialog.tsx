'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Upload } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/shared/components/PasswordInput'
import { formatCPF } from '@/shared/lib/format'
import { useSectors } from '@/features/sectors/hooks'
import { useCreateUser, useUpdateUser, useUser } from '../hooks'
import { userFormDialogSchema, type UserFormDialogData } from '../schemas'
import type { UserListItem } from '../types'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  STAFF: 'Colaborador',
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing?: UserListItem | null
}

export function UserFormDialog({ open, onOpenChange, editing }: Props) {
  const create = useCreateUser()
  const update = useUpdateUser()
  const { data: sectors = [] } = useSectors()
  const { data: userDetail, isLoading: isLoadingUser } = useUser(editing?.id ?? '', { enabled: !!editing && open })

  const isEditing = !!editing

  const form = useForm<UserFormDialogData>({
    resolver: zodResolver(userFormDialogSchema),
    defaultValues: { name: '', email: '', password: '', role: 'STAFF', cpf: '', jobTitle: '', sectorId: '' },
  })

  useEffect(() => {
    if (!open) {
      form.reset({ name: '', email: '', password: '', role: 'STAFF', cpf: '', jobTitle: '', sectorId: '' })
    }
  }, [open, form])

  useEffect(() => {
    if (isEditing && userDetail) {
      form.reset({
        name: userDetail.name,
        email: userDetail.email,
        password: '',
        role: userDetail.role,
        cpf: userDetail.cpf || '',
        jobTitle: userDetail.jobTitle || '',
        sectorId: userDetail.sector?.id || '',
        enabled: userDetail.enabled ?? true,
      })
    }
  }, [isEditing, userDetail, form])

  async function onSubmit(data: UserFormDialogData) {
    try {
      if (isEditing) {
        await update.mutateAsync({
          id: editing.id,
          data: {
            ...data,
            password: data.password || undefined,
          },
        })
        toast.success('Usuário atualizado!')
      } else {
        if (!data.password) {
          toast.error('Senha é obrigatória para cadastro de novo usuário.')
          return
        }
        await create.mutateAsync({
          name: data.name,
          email: data.email,
          password: data.password,
          cpf: data.cpf,
          jobTitle: data.jobTitle,
          sectorId: data.sectorId,
          role: data.role,
          file: data.file,
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        </DialogHeader>

        {isEditing && isLoadingUser ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand" size={32} /></div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nome</FormLabel>
                    <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>E-mail</FormLabel>
                    <FormControl><Input type="email" className="rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="cpf" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input 
                        className="rounded-xl" 
                        {...field} 
                        value={formatCPF(field.value ?? '')}
                        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="jobTitle" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="sectorId" render={({ field }) => (
                  <FormItem className="col-span-2 sm:col-span-1">
                    <FormLabel>Setor</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        {sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem className="col-span-2 sm:col-span-1">
                    <FormLabel>Perfil</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.entries(ROLE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{isEditing ? 'Nova Senha (opcional)' : 'Senha'}</FormLabel>
                    <FormControl><PasswordInput className="rounded-xl" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="file" render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Foto do Usuário</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2 font-medium">
                          <Upload size={16} className="text-brand" />
                          Escolher arquivo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) onChange(file)
                            }}
                            {...field}
                          />
                        </label>
                        <span className="text-sm text-gray-500 truncate max-w-[250px]" title={value instanceof File ? value.name : ''}>
                          {value instanceof File ? value.name : 'Nenhum arquivo escolhido'}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {isEditing && (
                  <FormField control={form.control} name="enabled" render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value ? 'true' : 'false'} onValueChange={(v: string) => field.onChange(v === 'true')}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="true">Ativo</SelectItem>
                          <SelectItem value="false">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button type="submit" disabled={create.isPending || update.isPending}>
                  {(create.isPending || update.isPending) ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
