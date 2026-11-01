'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Plus, Trash2, X, PackageOpen } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { hasAnyRole } from '@/shared/lib/rbac'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { useAuthStore } from '@/store/useAuthStore'
import { useEntry, useFinishEntry, useCancelEntry, useRemoveEntryItem } from '../hooks'
import { AddItemDialog } from './AddItemDialog'
import { entriesApi } from '../api'
import { itemTotalCents } from '../lib/invoice'
import { STATUS_LABELS, STATUS_COLORS, TYPE_LABELS } from './EntryAccordion'
import type { EntityId } from '@/shared/types/id'

const EXPIRATION_LABELS: Record<string, string> = { DATED: 'Vencimento', NON_EXPIRING: 'Sem validade', INDEFINITE: 'Validade indeterminada' }

export function EntryDetails({ id }: { id: EntityId }) {
  const [addOpen, setAddOpen] = useState(false)
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [pricesReady, setPricesReady] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const { data: entry, isLoading, isError, refetch } = useEntry(id)
  const finish = useFinishEntry()
  const cancel = useCancelEntry()
  const remove = useRemoveEntryItem()
  const role = useAuthStore((s) => s.user?.role)
  const canManage = hasAnyRole(role, ['ADMIN', 'MANAGER'])
  const pending = entry?.status === 'PENDING'
  const isSupplier = entry?.entryType === 'SUPPLIER'
  const storageKey = `entry-unit-prices:${id}`

  useEffect(() => {
    setPricesReady(false)
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
      if (!stored || typeof stored !== 'object' || Array.isArray(stored)) throw new Error('Dados inválidos')
      setPrices(stored)
      setStorageError(false)
    } catch { setPrices({}); setStorageError(true) }
    setPricesReady(true)
  }, [storageKey])

  function savePrices(next: Record<string, string>) {
    setPrices(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setStorageError(false) }
    catch { setStorageError(true) }
  }

  async function saveNewPrice(price: string) {
    try {
      const latest = await entriesApi.get(id)
      const existing = new Set(entry?.items?.map((item) => item.id) ?? [])
      const added = latest.items.filter((item) => !existing.has(item.id))
      if (added.length === 1) savePrices({ ...prices, [added[0].id]: price })
      else toast.error('Confira o valor unitário dos itens adicionados.')
    } catch { toast.error('Informe o valor unitário na lista de itens.') }
  }

  const itemValues = (entry?.items ?? []).map((item) => itemTotalCents(item.quantity, prices[item.id] ?? ''))
  const pricesComplete = itemValues.length > 0 && itemValues.every((value) => value !== null)
  const sumCents = itemValues.reduce<number>((sum, value) => sum + (value ?? 0), 0)
  const invoiceCents = entry?.supplierDetails ? Math.round(entry.supplierDetails.totalAmount * 100) : null
  const invoiceMatches = pricesReady && !storageError && pricesComplete && invoiceCents !== null && Number.isSafeInteger(sumCents) && sumCents === invoiceCents

  async function perform(action: () => Promise<unknown>, message: string) {
    try { await action(); toast.success(message) } catch { /* Erro exibido pelo cliente HTTP. */ }
  }

  return (
    <div className="space-y-6 p-4 pt-6 md:p-8">
      <Link href="/dashboard/entradas" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-violet-700"><ArrowLeft size={16} /> Voltar para entradas</Link>
      {isLoading && <p role="status" className="py-12 text-center text-sm text-slate-500">Carregando entrada...</p>}
      {isError && <div role="alert" className="rounded-2xl bg-white p-8 text-center"><p className="text-sm text-red-700">Não foi possível carregar esta entrada.</p><Button variant="outline" className="mt-4" onClick={() => refetch()}>Tentar novamente</Button></div>}
      {entry && !isError && <>
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Movimentação de estoque</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Detalhes da entrada</h1><p className="mt-1 break-all text-xs text-slate-500">Código: {entry.id}</p></div>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLORS[entry.status]}`}>{STATUS_LABELS[entry.status]}</span>
        </header>
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">Informações gerais</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div><dt className="text-xs font-medium text-slate-500">Tipo de entrada</dt><dd className="mt-1 text-sm font-medium text-slate-900">{TYPE_LABELS[entry.entryType] ?? entry.entryType}</dd></div>
            <div><dt className="text-xs font-medium text-slate-500">Data de chegada</dt><dd className="mt-1 text-sm font-medium text-slate-900">{formatDate(entry.arrivalAt)}</dd></div>
            <div><dt className="text-xs font-medium text-slate-500">Responsável</dt><dd className="mt-1 break-words text-sm font-medium text-slate-900">{entry.responsible || 'Não informado'}</dd></div>
            <div className="sm:col-span-2 lg:col-span-3"><dt className="text-xs font-medium text-slate-500">Observações</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">{entry.notes || 'Nenhuma observação registrada.'}</dd></div>
          </dl>
        </section>
        {entry.entryType === 'SUPPLIER' && (
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-slate-900">Dados da nota fiscal</h2>
            {entry.supplierDetails ? <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div><dt className="text-xs font-medium text-slate-500">Fornecedor</dt><dd className="mt-1 break-words text-sm font-medium text-slate-900">{entry.supplierDetails.supplierName || 'Não informado'}</dd></div>
              <div><dt className="text-xs font-medium text-slate-500">Número da nota fiscal</dt><dd className="mt-1 break-words text-sm font-medium text-slate-900">{entry.supplierDetails.invoiceNumber}</dd></div>
              <div><dt className="text-xs font-medium text-slate-500">Data de emissão</dt><dd className="mt-1 text-sm font-medium text-slate-900">{entry.supplierDetails.invoiceIssueDate.slice(0, 10).split('-').reverse().join('/')}</dd></div>
              <div><dt className="text-xs font-medium text-slate-500">Valor total</dt><dd className="mt-1 text-sm font-medium text-slate-900">{formatCurrency(entry.supplierDetails.totalAmount)}</dd></div>
              <div><dt className="text-xs font-medium text-slate-500">Licitação</dt><dd className="mt-1 break-words text-sm font-medium text-slate-900">{entry.supplierDetails.biddingCode}</dd></div>
              <div><dt className="text-xs font-medium text-slate-500">Empenho</dt><dd className="mt-1 break-words text-sm font-medium text-slate-900">{entry.supplierDetails.commitmentNote}</dd></div>
            </dl> : <p className="mt-4 text-sm text-slate-500">Dados da nota fiscal não disponíveis.</p>}
          </section>
        )}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-base font-semibold text-slate-900">Itens da entrada</h2><p className="mt-1 text-sm text-slate-500">{entry.items?.length ?? 0} {(entry.items?.length ?? 0) === 1 ? 'item registrado' : 'itens registrados'}</p></div>{pending && canManage && <Button variant="outline" onClick={() => setAddOpen(true)}><Plus size={16} /> Adicionar item</Button>}</div>
          {!entry.items?.length ? <div className="mt-5 rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"><PackageOpen className="mx-auto mb-2 text-slate-400" size={24} />Nenhum item adicionado.</div> : <ul className="mt-5 space-y-3">{entry.items.map((item) => <li key={item.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="min-w-0"><p className="break-words text-sm font-semibold text-slate-900">{item.materialName}</p><p className="mt-1 text-xs leading-5 text-slate-600">Quantidade: {item.quantity} · {EXPIRATION_LABELS[item.expirationType] ?? item.expirationType}{item.expirationDate ? `: ${formatDate(item.expirationDate)}` : ''}{item.lotCode ? ` · Lote: ${item.lotCode}` : ''}</p>{isSupplier && <div className="mt-3 flex flex-wrap items-end gap-3"><label className="flex flex-col gap-1 text-xs font-medium text-slate-600">Valor unitário (R$)<input type="number" min="0" step="0.01" inputMode="decimal" value={prices[item.id] ?? ''} disabled={!pending || !canManage || !pricesReady} onChange={(event) => savePrices({ ...prices, [item.id]: event.target.value })} className="h-9 w-32 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900" /></label><span className="pb-2 text-xs text-slate-600">Subtotal: {itemTotalCents(item.quantity, prices[item.id] ?? '') === null ? '—' : formatCurrency(itemTotalCents(item.quantity, prices[item.id])! / 100)}</span></div>}</div>{pending && canManage && <button type="button" onClick={() => perform(() => remove.mutateAsync({ entryId: id, itemId: item.id }), 'Item removido.')} disabled={remove.isPending} className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-700" aria-label={`Remover item ${item.materialName}`}><Trash2 size={16} /></button>}</li>)}</ul>}
        </section>
        {isSupplier && <section className="rounded-2xl border border-violet-100 bg-violet-50/50 p-5" aria-live="polite">
          <h2 className="text-sm font-semibold text-slate-900">Conferência da nota fiscal</h2>
          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-700"><p>Total dos itens: <strong>{formatCurrency(sumCents / 100)}</strong></p><p>Total da nota: <strong>{invoiceCents === null ? 'Não disponível' : formatCurrency(invoiceCents / 100)}</strong></p></div>
          <p className="mt-3 text-sm text-slate-700">{storageError ? 'Não foi possível salvar os valores neste navegador.' : !pricesReady ? 'Carregando valores...' : !pricesComplete ? 'Informe o valor unitário de todos os itens.' : invoiceCents === null ? 'Os dados da nota fiscal não estão disponíveis.' : invoiceMatches ? 'Os valores conferem.' : `Diferença: ${formatCurrency(Math.abs(invoiceCents - sumCents) / 100)} ${sumCents < invoiceCents ? 'abaixo' : 'acima'} do total da nota.`}</p>
        </section>}
        {pending && canManage && <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button variant="outline" className="text-red-700" disabled={cancel.isPending || finish.isPending} onClick={() => perform(() => cancel.mutateAsync(id), 'Entrada cancelada.')}><X size={16} /> Cancelar entrada</Button><Button className="bg-emerald-700 hover:bg-emerald-800" disabled={finish.isPending || cancel.isPending || !entry.items?.length || (isSupplier && !invoiceMatches)} onClick={() => perform(() => finish.mutateAsync(id), 'Entrada finalizada!')}><Check size={16} /> Finalizar entrada</Button></div>}
        {canManage && <AddItemDialog entryId={id} open={addOpen} onOpenChange={setAddOpen} isSupplier={isSupplier} onItemAdded={saveNewPrice} />}
      </>}
    </div>
  )
}
