'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateSupplier, useUpdateSupplier } from '../hooks'
import { supplierSchema, type SupplierFormData } from '../schemas'
import type { Supplier } from '../types'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing?: Supplier | null
}

export function SupplierFormDialog({ open, onOpenChange, editing }: Props) {
  const create = useCreateSupplier()
  const update = useUpdateSupplier()

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { name: '', cnpj: '', email: '', phone: '' },
  })

  useEffect(() => {
    form.reset(
      editing
        ? { name: editing.name, cnpj: editing.cnpj ?? '', email: editing.email ?? '', phone: editing.phone ?? '' }
        : { name: '', cnpj: '', email: '', phone: '' }
    )
  }, [editing, open])

  async function onSubmit(data: SupplierFormData) {
    const payload = {
      name: data.name,
      cnpj: data.cnpj || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
    }
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data: payload })
        toast.success('Fornecedor atualizado!')
      } else {
        await create.mutateAsync(payload)
        toast.success('Fornecedor cadastrado!')
      }
      onOpenChange(false)
    } catch {
      toast.error('Erro ao salvar fornecedor.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome *</FormLabel>
                <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cnpj" render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl><Input className="rounded-xl" placeholder="00.000.000/0000-00" {...field} /></FormControl>
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
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl><Input className="rounded-xl" placeholder="(85) 9 0000-0000" {...field} /></FormControl>
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
