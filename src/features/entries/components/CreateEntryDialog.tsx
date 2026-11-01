'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

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
      const created = await create.mutateAsync(payload)
      toast.success('Entrada criada!')
      form.reset()
      onOpenChange(false)
      router.push(`/dashboard/entradas/${encodeURIComponent(created.id)}`)
    } catch {
      // O interceptor do axios em client.ts já exibe o toast com a mensagem exata do backend
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:max-w-2xl sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900">Nova Entrada</DialogTitle>
          <DialogDescription>Registre a chegada dos materiais ao almoxarifado.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-2">
            <FormField
              control={form.control}
              name="entryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de entrada</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
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
                <FormLabel>Data e hora de chegada</FormLabel>
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
                <FormLabel>Observações <span className="font-normal text-slate-500">(opcional)</span></FormLabel>
                <FormControl><Textarea className="rounded-xl resize-none" placeholder="Acrescente informações relevantes sobre a entrada" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {type === 'SUPPLIER' && (
              <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                <div><h3 className="text-sm font-semibold text-slate-900">Dados da nota fiscal</h3><p className="mt-1 text-xs leading-5 text-slate-500">Informe os dados associados à entrada do fornecedor.</p></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="supplierDetails.supplierId"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Fornecedor</FormLabel>
                        <Select
                          value={field.value ?? ''}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
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
                    <FormItem className="sm:col-span-2">
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

            <DialogFooter className="border-t border-slate-100 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? 'Criando...' : 'Criar entrada'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
