'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { useDebounceValue } from 'usehooks-ts'
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
import { PackagePlus, CalendarDays, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { materialsApi } from '@/features/materials/api'
import type { Material } from '@/features/materials/types'
import type { EntityId } from '@/shared/types/id'
import { useAddEntryItem } from '../hooks'
import { itemTotalCents } from '../lib/invoice'
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
  isSupplier?: boolean
  onItemAdded?: (price: string) => Promise<void>
}

export function AddItemDialog({ entryId, open, onOpenChange, isSupplier = false, onItemAdded }: Props) {
  const [search, setSearch] = useState('')
  const [searchMode, setSearchMode] = useState<'name' | 'code'>('name')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Material | null>(null)
  const [debouncedSearch] = useDebounceValue(search.trim(), 300)
  const canSearch = open && !selected && debouncedSearch.length >= 2
  const { data: materialsPage, isFetching, isError, refetch } = useQuery({
    queryKey: ['entry-material-search', searchMode, debouncedSearch, page],
    queryFn: () => materialsApi.list({ page, size: 8, sort: 'name,asc', ...(searchMode === 'name' ? { search: debouncedSearch } : { internalCode: debouncedSearch }) }),
    enabled: canSearch,
  })
  const addItem = useAddEntryItem()
  const [unitPrice, setUnitPrice] = useState('')
  const [priceError, setPriceError] = useState(false)

  const form = useForm<AddEntryItemInput>({
    resolver: zodResolver(addEntryItemSchema),
    defaultValues: { materialId: '', quantity: 1, expirationType: 'DATED', validity: '' },
  })

  const expirationType = form.watch('expirationType')

  async function onSubmit(data: AddEntryItemInput) {
    if (isSupplier && itemTotalCents(Number(data.quantity), unitPrice) === null) { setPriceError(true); return }
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
      if (isSupplier && onItemAdded) await onItemAdded(unitPrice)
      toast.success('Item adicionado!')
      form.reset()
      setSelected(null)
      setSearch('')
      setPage(0)
      setUnitPrice('')
      setPriceError(false)
      onOpenChange(false)
    } catch {
      // O interceptor do axios em client.ts já exibe o toast com a mensagem exata do backend
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:max-w-2xl sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900">Adicionar Item</DialogTitle>
          <DialogDescription>Informe o material e os dados do lote para esta entrada.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-2">
            <div className="flex items-center gap-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-violet-700 ring-1 ring-violet-100"><PackagePlus size={22} aria-hidden="true" /></span>
              <div><p className="text-sm font-semibold text-slate-900">Material da entrada</p><p className="mt-1 text-xs leading-5 text-slate-600">Selecione o material e registre a quantidade recebida.</p></div>
            </div>
            <FormField control={form.control} name="materialId" render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                {selected ? (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50/60 p-3">
                    <div className="min-w-0"><p className="break-words text-sm font-semibold text-slate-900">{selected.name}</p><p className="mt-0.5 text-xs text-slate-600">Código: {selected.internalCode}</p></div>
                    <button type="button" onClick={() => { setSelected(null); field.onChange(''); setSearch(''); setPage(0) }} className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-white hover:text-violet-700" aria-label="Alterar material"><X size={18} /></button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <label className="sr-only" htmlFor="material-search-mode">Buscar material por</label>
                      <select id="material-search-mode" value={searchMode} onChange={(event) => { setSearchMode(event.target.value as 'name' | 'code'); setPage(0) }} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"><option value="name">Nome ou descrição</option><option value="code">Código interno</option></select>
                      <div className="relative min-w-0 flex-1"><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" /><FormControl><Input aria-label="Buscar material" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0) }} placeholder={searchMode === 'name' ? 'Digite o nome ou a descrição' : 'Digite o código interno'} className="h-10 rounded-xl pl-10" autoComplete="off" /></FormControl></div>
                    </div>
                    {search.trim().length < 2 ? <p className="text-xs text-slate-500">Digite pelo menos 2 caracteres para buscar.</p> : search.trim() !== debouncedSearch || isFetching ? <p role="status" className="text-xs text-slate-500">Buscando materiais...</p> : isError ? <div role="alert" className="text-xs text-red-700">Não foi possível buscar materiais. <button type="button" className="font-semibold underline" onClick={() => refetch()}>Tentar novamente</button></div> : materialsPage && (
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        {materialsPage.content.length === 0 ? <p className="p-4 text-sm text-slate-500">Nenhum material encontrado.</p> : <ul aria-label="Resultados da busca de materiais" className="divide-y divide-slate-100">{materialsPage.content.map((material) => <li key={material.id}><button type="button" onClick={() => { setSelected(material); field.onChange(material.id) }} className="w-full px-4 py-3 text-left hover:bg-violet-50 focus-visible:bg-violet-50 focus-visible:outline-2 focus-visible:outline-violet-600"><span className="block break-words text-sm font-medium text-slate-900">{material.name}</span><span className="mt-0.5 block text-xs text-slate-500">{material.internalCode} · {material.measurementUnitName}</span></button></li>)}</ul>}
                        {materialsPage.totalPages > 1 && <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-3 py-2 text-xs text-slate-600"><button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-lg px-2 py-1 font-medium hover:bg-slate-100 disabled:opacity-40">Anterior</button><span>Página {page + 1} de {materialsPage.totalPages}</span><button type="button" disabled={page + 1 >= materialsPage.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg px-2 py-1 font-medium hover:bg-slate-100 disabled:opacity-40">Próxima</button></div>}
                      </div>
                    )}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                    <FormLabel>Tipo de validade</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
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

            {isSupplier && <div className="space-y-2">
              <label htmlFor="entry-unit-price" className="text-sm font-medium text-slate-800">Valor unitário (R$)</label>
              <Input id="entry-unit-price" type="number" min="0" step="0.01" inputMode="decimal" value={unitPrice} onChange={(event) => { setUnitPrice(event.target.value); setPriceError(false) }} placeholder="0,00" className="rounded-xl" aria-invalid={priceError} aria-describedby={priceError ? 'entry-unit-price-error' : undefined} />
              {priceError && <p id="entry-unit-price-error" className="text-sm text-red-700">Informe um valor válido com até duas casas decimais.</p>}
              <p className="text-xs text-slate-500">Usado para conferir o total da nota fiscal.</p>
            </div>}

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <CalendarDays size={18} className="mt-0.5 shrink-0 text-violet-600" aria-hidden="true" />
              <p>{expirationType === 'DATED' ? 'Informe a data de validade indicada no lote.' : expirationType === 'NON_EXPIRING' ? 'Este material não possui data de validade.' : 'A validade deste lote é indeterminada.'}</p>
            </div>
            {expirationType === 'DATED' && (
              <FormField
                control={form.control}
                name="validity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de validade</FormLabel>
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

            <DialogFooter className="border-t border-slate-100 pt-4">
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
