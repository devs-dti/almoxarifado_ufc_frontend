'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useSuppliers } from '@/features/suppliers/hooks'
import type { Supplier } from '@/features/suppliers/types'
import { useCreateEntry } from '../hooks'
import { createEntrySchema, type CreateEntryValues } from '../schemas'

const TYPE_LABELS: Record<string, string> = {
  SUPPLIER: 'Fornecedor',
  DONATION: 'Doação',
  RETURN: 'Devolução',
}

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function CreateEntryDialog({ open, onOpenChange }: Props) {
  const { data: suppliers = [] } = useSuppliers()
  const create = useCreateEntry()

  const form = useForm<CreateEntryValues>({
    resolver: zodResolver(createEntrySchema),
    defaultValues: { type: 'SUPPLIER', supplierId: undefined },
  })

  const type = form.watch('type')

  async function onSubmit(data: CreateEntryValues) {
    try {
      await create.mutateAsync(data)
      toast.success('Entrada criada!')
      form.reset()
      onOpenChange(false)
    } catch {
      toast.error('Erro ao criar entrada.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Nova Entrada</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(TYPE_LABELS).map(([v, l]) => (
                        <SelectItem key={v} value={v}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === 'SUPPLIER' && (
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fornecedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((s: Supplier) => (
                          <SelectItem key={s.id} value={String(s.id)}>{s.corporateName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? 'Criando...' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
