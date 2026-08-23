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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSuppliers } from '@/features/suppliers/hooks'
import { useCreateEntry } from '../hooks'
import { createEntrySchema, type CreateEntryInput } from '../schemas'
import type { CreateEntryPayload } from '../types'

const TYPE_LABELS: Record<string, string> = {
  SUPPLIER: 'Fornecedor',
  DONATION: 'Doação',
  INVENTORY_ADJUSTMENT: 'Ajuste de Estoque',
  RETURN: 'Devolução',
  OTHERS: 'Outros',
}

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function CreateEntryDialog({ open, onOpenChange }: Props) {
  const { data: suppliers = [] } = useSuppliers()
  const create = useCreateEntry()

  const form = useForm<CreateEntryInput>({
    resolver: zodResolver(createEntrySchema),
    defaultValues: { 
      entryType: 'SUPPLIER', 
      arrivalAt: '', 
      notes: '',
      supplierDetails: {
        supplierId: '',
        invoiceNumber: '',
        invoiceIssueDate: '',
        totalAmount: 0,
        biddingCode: '',
        commitmentNote: '',
      }
    },
  })

  const type = form.watch('entryType')

  async function onSubmit(data: CreateEntryInput) {
    try {
      const formatIso = (val?: string) => {
        if (!val) return undefined
        try {
          const d = new Date(val.includes('T') ? val : `${val}T00:00:00`)
          if (!isNaN(d.getTime())) return d.toISOString()
        } catch {}
        if (val.length === 16) return `${val}:00Z`
        if (val.length === 10) return `${val}T00:00:00Z`
        return val
      }

      const payload: CreateEntryPayload = {
        entryType: data.entryType,
        arrivalAt: formatIso(data.arrivalAt) || new Date().toISOString(),
        notes: data.notes?.trim() || undefined,
        supplierDetailsConsistent: data.entryType === 'SUPPLIER',
        supplierDetails: data.entryType === 'SUPPLIER' && data.supplierDetails?.supplierId ? {
          supplierId: data.supplierDetails.supplierId,
          invoiceNumber: data.supplierDetails.invoiceNumber?.trim() || '',
          invoiceIssueDate: formatIso(data.supplierDetails.invoiceIssueDate) || new Date().toISOString(),
          totalAmount: Number(data.supplierDetails.totalAmount) || 0,
          biddingCode: data.supplierDetails.biddingCode?.trim() || '',
          commitmentNote: data.supplierDetails.commitmentNote?.trim() || '',
        } : undefined,
      }
      await create.mutateAsync(payload)
      toast.success('Entrada criada!')
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
          <DialogTitle>Nova Entrada</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <FormField
              control={form.control}
              name="entryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Entrada</FormLabel>
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

            <FormField control={form.control} name="arrivalAt" render={({ field }) => (
              <FormItem>
                <FormLabel>Data/Hora de Chegada</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    min="2000-01-01T00:00"
                    max="2099-12-31T23:59"
                    className="rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Observações (Opcional)</FormLabel>
                <FormControl><Textarea className="rounded-xl resize-none" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {type === 'SUPPLIER' && (
              <div className="space-y-4 border-t border-gray-100 pt-4 mt-2">
                <h3 className="text-sm font-semibold text-gray-900">Dados da Nota Fiscal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="supplierDetails.supplierId"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Fornecedor</FormLabel>
                        <Select
                          value={field.value ?? ''}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {suppliers.map((s) => (
                              <SelectItem key={s.id} value={s.id}>{s.corporateName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="supplierDetails.invoiceNumber" render={({ field }) => (
                    <FormItem><FormLabel>Nº da NF</FormLabel><FormControl><Input className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="supplierDetails.totalAmount" render={({ field }) => (
                    <FormItem><FormLabel>Valor Total (R$)</FormLabel><FormControl><Input type="number" step="0.01" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="supplierDetails.invoiceIssueDate" render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Data de Emissão da NF</FormLabel>
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
                  )} />
                  <FormField control={form.control} name="supplierDetails.biddingCode" render={({ field }) => (
                    <FormItem><FormLabel>Licitação</FormLabel><FormControl><Input className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="supplierDetails.commitmentNote" render={({ field }) => (
                    <FormItem><FormLabel>Empenho</FormLabel><FormControl><Input className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>
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
