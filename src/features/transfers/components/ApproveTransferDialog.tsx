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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useApproveTransfer } from '../hooks'
import { approveTransferSchema, type ApproveTransferValues } from '../schemas'
import type { Transfer } from '../types'

type Props = {
  transfer: Transfer | null
  onOpenChange: (v: boolean) => void
}

export function ApproveTransferDialog({ transfer, onOpenChange }: Props) {
  const approve = useApproveTransfer()
  const open = transfer !== null

  const form = useForm<ApproveTransferValues>({
    resolver: zodResolver(approveTransferSchema),
    values: {
      items: transfer?.items.map((item) => ({
        transferItemId: item.id,
        approvedQuantity: item.quantity,
      })) ?? [],
    },
  })

  function handleClose() {
    form.reset()
    onOpenChange(false)
  }

  async function onSubmit(data: ApproveTransferValues) {
    if (!transfer) return
    try {
      await approve.mutateAsync({ id: transfer.id, data })
      toast.success('Transferência aprovada!')
      handleClose()
    } catch {
      toast.error('Erro ao aprovar transferência.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Aprovar Transferência</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 pt-2">
            {transfer?.items.map((item, index) => (
              <div key={item.id} className="bg-gray-50 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-800">{item.name}</span>
                  <span className="text-[10px] text-gray-400">
                    Solicitado: {item.quantity} {item.measurementUnit}
                  </span>
                </div>
                <FormField
                  control={form.control}
                  name={`items.${index}.approvedQuantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Qtd. aprovada</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          max={item.quantity}
                          className="rounded-xl text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={approve.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {approve.isPending ? 'Aprovando...' : 'Aprovar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
