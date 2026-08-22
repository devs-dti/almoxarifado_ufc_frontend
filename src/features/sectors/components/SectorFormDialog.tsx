'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateSector, useUpdateSector } from '../hooks'
import { sectorSchema, type SectorFormData } from '../schemas'
import type { Sector } from '../types'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing?: Sector | null
}

export function SectorFormDialog({ open, onOpenChange, editing }: Props) {
  const create = useCreateSector()
  const update = useUpdateSector()

  const form = useForm<SectorFormData>({
    resolver: zodResolver(sectorSchema),
    defaultValues: { name: '', code: '' },
  })

  useEffect(() => {
    form.reset(editing ? { name: editing.name, code: editing.code ?? '' } : { name: '', code: '' })
  }, [editing, open, form])

  async function onSubmit(data: SectorFormData) {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data })
        toast.success('Setor atualizado!')
      } else {
        await create.mutateAsync(data)
        toast.success('Setor cadastrado!')
      }
      onOpenChange(false)
    } catch {
      toast.error('Erro ao salvar setor.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar Setor' : 'Novo Setor'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl><Input className="rounded-xl" placeholder="Ex: Tecnologia da Informação" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="code" render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl><Input className="rounded-xl" placeholder="Ex: TI-001" {...field} /></FormControl>
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
