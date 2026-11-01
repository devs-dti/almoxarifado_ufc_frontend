'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MaterialSearch } from './MaterialSearch'
import { useCreateTransfer } from '../hooks'
import { createTransferSchema, type CreateTransferValues } from '../schemas'
import type { TransferType } from '../types'

const EXIT_TYPE_LABELS: Record<TransferType, string> = {
  SECTOR: 'Setor',
  CLAIM: 'Requisição',
  DONATION: 'Doação',
  EXPIRATION: 'Vencimento',
  OTHERS: 'Outros',
  INVENTORY_ADJUSTMENT: 'Ajuste de Estoque',
}

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function CreateTransferDialog({ open, onOpenChange }: Props) {
  const router = useRouter()
  const create = useCreateTransfer()

  const form = useForm<CreateTransferValues>({
    resolver: zodResolver(createTransferSchema),
    defaultValues: { exitType: 'SECTOR', notes: '', items: [{ materialId: '', requestedQuantity: 1 }] },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' })

  function handleClose() {
    form.reset()
    onOpenChange(false)
  }

  async function onSubmit(data: CreateTransferValues) {
    try {
      const created = await create.mutateAsync(data)
      toast.success('Transferência solicitada!')
      handleClose()
      router.push(`/dashboard/transferencias/${encodeURIComponent(created.id)}`)
    } catch {
      // O interceptor do axios em client.ts já exibe o toast com a mensagem exata do backend
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:max-w-2xl sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900">Nova Transferência</DialogTitle>
          <DialogDescription>Informe o destino e os materiais solicitados.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <FormField
              control={form.control}
              name="exitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Saída</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(EXIT_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Motivo da saída, número do documento, etc."
                      className="rounded-xl resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">Itens</span>
                {form.formState.errors.items?.root?.message && (
                  <span className="text-xs text-destructive font-medium mt-1">
                    {form.formState.errors.items.root.message}
                  </span>
                )}
                {form.formState.errors.items?.message && (
                  <span className="text-xs text-destructive font-medium mt-1">
                    {form.formState.errors.items.message as string}
                  </span>
                )}
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2 border border-slate-100 bg-slate-50 rounded-2xl p-4">
                  <div className="flex min-w-0 flex-col gap-3 flex-1">
                    <FormField
                      control={form.control}
                      name={`items.${index}.materialId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material {index + 1}</FormLabel>
                          <MaterialSearch index={index} onChange={field.onChange} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.requestedQuantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade solicitada</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Quantidade"
                              className="rounded-xl text-xs"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Remover item ${index + 1}`}
                      className="p-1.5 mt-1 rounded-lg text-gray-300 hover:text-destructive hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ materialId: '', requestedQuantity: 1 })}
                className="flex items-center gap-1.5 text-xs text-brand hover:text-brand-hover font-medium py-1"
              >
                <Plus size={13} />
                Adicionar item
              </button>
            </div>

            <DialogFooter className="border-t border-slate-100 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? 'Criando...' : 'Solicitar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
