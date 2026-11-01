'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateSupplier, useUpdateSupplier } from '../hooks'
import { supplierSchema, type SupplierFormData } from '../schemas'
import type { Supplier } from '../types'
import { maskCEP, maskCNPJ, maskPhone } from '@/lib/masks'

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
    defaultValues: {
      corporateName: '',
      cnpj: '',
      email: '',
      phone: '',
      address: { street: '', number: '', complement: '', city: '', state: '', cep: '' }
    },
  })

  useEffect(() => {
    form.reset(
      editing
        ? {
            corporateName: editing.corporateName,
            cnpj: editing.cnpj ?? '',
            email: editing.email ?? '',
            phone: editing.phone ?? '',
            address: {
              street: editing.address?.street ?? '',
              number: editing.address?.number ?? '',
              complement: editing.address?.complement ?? '',
              city: editing.address?.city ?? '',
              state: editing.address?.state ?? '',
              cep: editing.address?.cep ?? ''
            }
          }
        : {
            corporateName: '',
            cnpj: '',
            email: '',
            phone: '',
            address: { street: '', number: '', complement: '', city: '', state: '', cep: '' }
          }
    )
  }, [editing, open, form])

  // ViaCEP integration
  const watchCep = form.watch('address.cep')
  useEffect(() => {
    const fetchCep = async (cep: string) => {
      const cleanCep = cep.replace(/\D/g, '')
      if (cleanCep.length === 8) {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
          const data = await res.json()
          if (!data.erro) {
            form.setValue('address.street', data.logradouro || '')
            form.setValue('address.city', data.localidade || '')
            form.setValue('address.state', data.uf || '')
            // Set focus to number input
            setTimeout(() => {
              document.getElementsByName('address.number')[0]?.focus()
            }, 100)
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error)
        }
      }
    }

    if (watchCep && watchCep.length >= 9 && (!editing?.address?.cep || watchCep.replace(/\D/g, '') !== editing.address.cep.replace(/\D/g, ''))) {
      fetchCep(watchCep)
    }
  }, [watchCep, form, editing])

  async function onSubmit(data: SupplierFormData) {
    const payload = {
      corporateName: data.corporateName,
      cnpj: data.cnpj || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      address: {
        street: data.address.street,
        number: data.address.number,
        complement: data.address.complement,
        city: data.address.city,
        state: data.address.state,
        cep: data.address.cep,
      },
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
      // O interceptor do axios em client.ts já exibe o toast com a mensagem exata do backend
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:max-w-2xl sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900">{editing ? 'Editar fornecedor' : 'Novo fornecedor'}</DialogTitle>
          <DialogDescription>{editing ? 'Atualize os dados do fornecedor.' : 'Preencha os dados para cadastrar um fornecedor.'}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <FormField control={form.control} name="corporateName" render={({ field }) => (
              <FormItem>
                <FormLabel>Razão Social *</FormLabel>
                <FormControl><Input className="rounded-xl" {...field} value={field.value ?? ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cnpj" render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl><Input className="rounded-xl" placeholder="00.000.000/0000-00" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(maskCNPJ(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl><Input type="email" className="rounded-xl" {...field} value={field.value ?? ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl><Input className="rounded-xl" placeholder="(85) 9 0000-0000" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(maskPhone(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Endereço */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
              <span className="text-sm font-semibold text-gray-700 mb-4 block">Endereço</span>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="address.cep" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl><Input className="rounded-xl" placeholder="00000-000" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(maskCEP(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="address.street" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="address.number" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="address.complement" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="address.city" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="address.state" render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <FormControl><Input className="rounded-xl" placeholder="CE" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
            <DialogFooter className="border-t border-slate-100 pt-4">
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
