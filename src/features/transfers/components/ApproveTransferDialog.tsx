'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

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
      // O interceptor do axios em client.ts já exibe o toast com a mensagem exata do backend
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:max-w-xl sm:p-7">
        <DialogHeader>
          <DialogTitle>Aprovar Transferência</DialogTitle>
          <DialogDescription>Confira as quantidades que serão liberadas.</DialogDescription>
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

            <DialogFooter className="border-t border-slate-100 pt-4">
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
