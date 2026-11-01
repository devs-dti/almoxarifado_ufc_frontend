'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateUnit, useUpdateUnit } from '../hooks'
import { unitSchema, type UnitFormData } from '../schemas'
import type { MeasurementUnit } from '../types'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing?: MeasurementUnit | null
}

export function UnitFormDialog({ open, onOpenChange, editing }: Props) {
  const create = useCreateUnit()
  const update = useUpdateUnit()

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: { name: '', abbreviation: '' },
  })

  useEffect(() => {
    form.reset(editing ? { name: editing.name, abbreviation: editing.abbreviation } : { name: '', abbreviation: '' })
  }, [editing, open, form])

  async function onSubmit(data: UnitFormData) {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data })
        toast.success('Unidade atualizada!')
      } else {
        await create.mutateAsync(data)
        toast.success('Unidade cadastrada!')
      }
      onOpenChange(false)
    } catch {
      // O interceptor do axios em client.ts já exibe o toast com a mensagem exata do backend
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:max-w-lg sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900">{editing ? 'Editar unidade de medida' : 'Nova unidade de medida'}</DialogTitle>
          <DialogDescription>{editing ? 'Atualize os dados da unidade.' : 'Informe o nome e a abreviação da unidade.'}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl><Input className="rounded-xl" placeholder="Ex: Quilograma" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="abbreviation" render={({ field }) => (
              <FormItem>
                <FormLabel>Abreviação</FormLabel>
                <FormControl><Input className="rounded-xl" placeholder="Ex: kg" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
