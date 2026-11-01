'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
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
import { UserAvatar } from './UserAvatar'

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
  const { data: userDetail, isLoading: isLoadingUser, isError: isUserError, refetch: refetchUser } = useUser(editing?.id ?? '', { enabled: !!editing && open })

  const isEditing = !!editing
  const [preview, setPreview] = useState<string | null>(null)

  const form = useForm<UserFormDialogData>({
    resolver: zodResolver(userFormDialogSchema),
    defaultValues: { name: '', email: '', password: '', role: 'STAFF', cpf: '', jobTitle: '', sectorId: '' },
  })

  const selectedFile = form.watch('file') as File | undefined
  useEffect(() => {
    if (!open || !(selectedFile instanceof File)) { setPreview(null); return }
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedFile, open])

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
      // O interceptor do axios em client.ts já exibe o toast com a mensagem exata do backend
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:max-w-2xl sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900">{isEditing ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
          <DialogDescription>{isEditing ? 'Atualize os dados e o acesso do usuário.' : 'Preencha os dados e defina o perfil de acesso.'}</DialogDescription>
        </DialogHeader>

        {isEditing && isLoadingUser ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand" size={32} /></div>
        ) : isEditing && isUserError ? (
          <div role="alert" className="py-8 text-center text-sm text-red-700">Não foi possível carregar o usuário. <button type="button" onClick={() => refetchUser()} className="font-semibold underline">Tentar novamente</button></div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
              <FormField control={form.control} name="file" render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Foto do usuário <span className="font-normal text-slate-500">(opcional)</span></FormLabel>
                  <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center">
                    <UserAvatar src={preview ?? (isEditing ? userDetail?.imageUrl : null)} name={userDetail?.name || 'usuário'} large />
                    <div className="min-w-0 space-y-2">
                      <p className="text-sm font-medium text-slate-800">{preview || (isEditing && userDetail?.imageUrl) ? 'Foto do usuário' : 'Adicione uma foto'}</p>
                      <p className="text-xs leading-5 text-slate-500">Uma foto ajuda a identificar o usuário no sistema.</p>
                      <FormControl><input {...field} type="file" accept="image/*" className="block w-full text-xs text-slate-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-violet-100 file:px-3 file:py-2 file:font-semibold file:text-violet-800 hover:file:bg-violet-200" onChange={(event) => onChange(event.target.files?.[0])} /></FormControl>
                      {value instanceof File && <p className="break-all text-xs text-slate-500">{value.name}</p>}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Nome</FormLabel>
                    <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
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
                  <FormItem className="sm:col-span-1">
                    <FormLabel>Setor</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        {sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>Perfil</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.entries(ROLE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>{isEditing ? 'Nova Senha (opcional)' : 'Senha'}</FormLabel>
                    <FormControl><PasswordInput className="rounded-xl" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />



                {isEditing && (
                  <FormField control={form.control} name="enabled" render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value ? 'true' : 'false'} onValueChange={(v: string) => field.onChange(v === 'true')}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
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

              <DialogFooter className="border-t border-slate-100 pt-4">
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
