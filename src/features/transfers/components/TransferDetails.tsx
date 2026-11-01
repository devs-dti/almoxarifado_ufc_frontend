'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, X, PackageOpen } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { hasAnyRole } from '@/shared/lib/rbac'
import { formatDate, formatDateTime } from '@/shared/lib/format'
import { useTransfer, useDisapproveTransfer } from '../hooks'
import { ApproveTransferDialog } from './ApproveTransferDialog'
import { STATUS_LABELS, STATUS_COLORS, TYPE_LABELS } from './TransferAccordion'

export function TransferDetails({ id }: { id: string }) {
  const [approveOpen, setApproveOpen] = useState(false)
  const { data, isLoading, isError, refetch } = useTransfer(id)
  const disapprove = useDisapproveTransfer()
  const role = useAuthStore((state) => state.user?.role)
  const canManage = hasAnyRole(role, ['ADMIN', 'MANAGER'])
  async function handleDeny() { try { await disapprove.mutateAsync(id); toast.success('Transferência reprovada.') } catch { /* Erro exibido pelo cliente HTTP. */ } }
  return <div className="space-y-6 p-4 pt-6 md:p-8">
    <Link href="/dashboard/transferencias" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-violet-700"><ArrowLeft size={16} /> Voltar para transferências</Link>
    {isLoading && <p role="status" className="py-12 text-center text-sm text-slate-500">Carregando transferência...</p>}
    {isError && <div role="alert" className="rounded-2xl bg-white p-8 text-center"><p className="text-sm text-red-700">Não foi possível carregar esta transferência.</p><Button variant="outline" className="mt-4" onClick={() => refetch()}>Tentar novamente</Button></div>}
    {data && !isError && <>
      <header className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Movimentação de estoque</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Detalhes da transferência</h1><p className="mt-1 break-all text-xs text-slate-500">Código: {data.id}</p></div><span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLORS[data.status]}`}>{STATUS_LABELS[data.status]}</span></header>
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-base font-semibold text-slate-900">Informações gerais</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div><dt className="text-xs text-slate-500">Tipo de saída</dt><dd className="mt-1 text-sm font-medium">{TYPE_LABELS[data.exitType]}</dd></div><div><dt className="text-xs text-slate-500">Solicitante</dt><dd className="mt-1 break-words text-sm font-medium">{data.requester || 'Não informado'}</dd></div><div><dt className="text-xs text-slate-500">Setor</dt><dd className="mt-1 break-words text-sm font-medium">{data.sector || 'Não informado'}</dd></div><div><dt className="text-xs text-slate-500">Solicitada em</dt><dd className="mt-1 text-sm font-medium">{formatDateTime(data.createdAt)}</dd></div><div><dt className="text-xs text-slate-500">Responsável pela decisão</dt><dd className="mt-1 text-sm font-medium">{data.issuer || 'Não informado'}</dd></div><div><dt className="text-xs text-slate-500">Data de saída</dt><dd className="mt-1 text-sm font-medium">{data.exitDate ? formatDate(data.exitDate) : 'Não informada'}</dd></div>
      </dl></section>
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-base font-semibold text-slate-900">Itens da transferência</h2><p className="mt-1 text-sm text-slate-500">{data.items?.length ?? 0} {(data.items?.length ?? 0) === 1 ? 'item' : 'itens'}</p>{!data.items?.length ? <div className="mt-5 rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500"><PackageOpen className="mx-auto mb-2" size={24} />Nenhum item encontrado.</div> : <ul className="mt-5 space-y-3">{data.items.map((item) => <li key={item.id} className="flex flex-wrap justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4"><span className="break-words text-sm font-semibold text-slate-900">{item.name}</span><span className="text-sm text-slate-600">Quantidade: {item.quantity} {item.measurementUnit}</span></li>)}</ul>}</section>
      {data.status === 'PENDING' && canManage && <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button variant="outline" className="text-red-700" disabled={disapprove.isPending} onClick={handleDeny}><X size={16} /> Reprovar</Button><Button className="bg-emerald-700 hover:bg-emerald-800" disabled={disapprove.isPending} onClick={() => setApproveOpen(true)}><Check size={16} /> Aprovar</Button></div>}
      {canManage && <ApproveTransferDialog transfer={approveOpen ? data : null} onOpenChange={setApproveOpen} />}
    </>}
  </div>
}
