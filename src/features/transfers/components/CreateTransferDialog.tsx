'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'

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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMaterials } from '@/features/materials/hooks'
import { useSectors } from '@/features/sectors/hooks'
import { useCreateTransfer } from '../hooks'
import { createTransferSchema, type CreateTransferValues } from '../schemas'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function CreateTransferDialog({ open, onOpenChange }: Props) {
  const { data: materialsPage } = useMaterials({ page: 0, size: 100 })
  const materials = materialsPage?.content ?? []
  const { data: sectors = [] } = useSectors()
  const create = useCreateTransfer()

  const form = useForm<CreateTransferValues>({
    resolver: zodResolver(createTransferSchema),
    defaultValues: { sectorId: '', items: [{ materialId: '', requestedQuantity: 1 }] },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' })

  function handleClose() {
    form.reset()
    onOpenChange(false)
  }

  async function onSubmit(data: CreateTransferValues) {
    try {
      await create.mutateAsync(data)
      toast.success('Transferência solicitada!')
      handleClose()
    } catch {
      toast.error('Erro ao criar transferência.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Transferência</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <FormField
              control={form.control}
              name="sectorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sectors.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Itens</span>

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                  <div className="flex flex-col gap-2 flex-1">
                    <FormField
                      control={form.control}
                      name={`items.${index}.materialId`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="text-xs">
                                <SelectValue placeholder="Material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {materials.map((m) => (
                                <SelectItem key={m.id} value={m.id}>
                                  {m.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.requestedQuantity`}
                      render={({ field }) => (
                        <FormItem>
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

            <DialogFooter className="pt-2">
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
