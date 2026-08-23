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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMaterials } from '@/features/materials/hooks'
import type { EntityId } from '@/shared/types/id'
import { useAddEntryItem } from '../hooks'
import { addEntryItemSchema, type AddEntryItemInput } from '../schemas'
import type { AddEntryItemPayload } from '../types'

const EXPIRATION_LABELS: Record<string, string> = {
  DATED: 'Com Validade',
  NON_EXPIRING: 'Sem Validade',
  INDEFINITE: 'Indeterminado',
}

type Props = {
  entryId: EntityId
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function AddItemDialog({ entryId, open, onOpenChange }: Props) {
  const { data: materialsPage } = useMaterials({ page: 0, size: 100 })
  const materials = materialsPage?.content ?? []
  const addItem = useAddEntryItem()

  const form = useForm<AddEntryItemInput>({
    resolver: zodResolver(addEntryItemSchema),
    defaultValues: { materialId: '', quantity: 1, expirationType: 'DATED', validity: '' },
  })

  const expirationType = form.watch('expirationType')

  async function onSubmit(data: AddEntryItemInput) {
    try {
      const payload: AddEntryItemPayload = {
        materialId: data.materialId,
        quantity: Number(data.quantity),
        expirationType: data.expirationType,
        validity: data.expirationType === 'DATED' && data.validity ? data.validity.split('T')[0] : undefined,
        validityConsistentWithExpirationType: true,
      }
      await addItem.mutateAsync({
        entryId,
        data: payload,
      })
      toast.success('Item adicionado!')
      form.reset()
      onOpenChange(false)
    } catch {
      // O interceptor do axios em client.ts já exibe o toast com a mensagem exata do backend
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Adicionar Item</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <FormField
              control={form.control}
              name="materialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o material" />
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

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expirationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Validade</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(EXPIRATION_LABELS).map(([v, l]) => (
                          <SelectItem key={v} value={v}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {expirationType === 'DATED' && (
              <FormField
                control={form.control}
                name="validity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Validade</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min="2000-01-01"
                        max="2099-12-31"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={addItem.isPending}>
                {addItem.isPending ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
