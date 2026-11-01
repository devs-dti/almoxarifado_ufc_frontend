import Link from 'next/link'
import { ArrowUpRight, ClipboardList } from 'lucide-react'
import { formatDate } from '@/shared/lib/format'
import type { Entry, EntryStatus } from '../types'

export const STATUS_LABELS: Record<EntryStatus, string> = { PENDING: 'Pendente', FINISHED: 'Finalizada', CANCELED: 'Cancelada' }
export const STATUS_COLORS: Record<EntryStatus, string> = { PENDING: 'text-amber-700 bg-amber-50 border-amber-200', FINISHED: 'text-emerald-700 bg-emerald-50 border-emerald-200', CANCELED: 'text-red-700 bg-red-50 border-red-200' }
export const TYPE_LABELS: Record<string, string> = { SUPPLIER: 'Fornecedor', DONATION: 'Doação', INVENTORY_ADJUSTMENT: 'Ajuste de estoque', RETURN: 'Devolução', OTHERS: 'Outros' }

export function EntryAccordion({ entry }: { entry: Entry }) {
  return (
    <Link href={`/dashboard/entradas/${encodeURIComponent(entry.id)}`} className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:gap-4">
      <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700 sm:grid"><ClipboardList size={20} /></span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2"><span className="break-all text-sm font-semibold text-slate-900">Entrada #{entry.id}</span><span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[entry.status]}`}>{STATUS_LABELS[entry.status]}</span></span>
        <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500"><span>{TYPE_LABELS[entry.entryType] ?? entry.entryType}</span><span>Chegada: {formatDate(entry.arrivalAt)}</span>{entry.responsible && <span>Responsável: {entry.responsible}</span>}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-violet-700"><span className="hidden sm:inline">Ver detalhes</span><ArrowUpRight size={18} /></span>
    </Link>
  )
}
