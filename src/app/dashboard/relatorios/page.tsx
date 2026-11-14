'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowRightLeft, CalendarDays, FileBarChart, Mail, PackageOpen, TriangleAlert } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { InventoryReportDialog } from '@/features/reports/components/InventoryReportDialog'
import { LowStockReportDialog } from '@/features/reports/components/LowStockReportDialog'
import { ExpiringReportDialog } from '@/features/reports/components/ExpiringReportDialog'
import { EntriesSummaryDialog } from '@/features/reports/components/EntriesSummaryDialog'
import { TransfersSummaryDialog } from '@/features/reports/components/TransfersSummaryDialog'

type ReportKey = 'inventory' | 'low-stock' | 'expiring' | 'entries' | 'transfers'

const reportGroups = [
  {
    title: 'Estoque',
    description: 'Consulte saldos e acompanhe os lotes.',
    reports: [
      { key: 'inventory', title: 'Relação Geral de Itens em Estoque', description: 'Visualize materiais, lotes e seus saldos atuais.', icon: FileBarChart },
      { key: 'low-stock', title: 'Materiais com Estoque Zerado ou Baixo', description: 'Identifique os materiais que precisam de atenção.', icon: TriangleAlert },
      { key: 'expiring', title: 'Controle de Vencimentos por Lote', description: 'Consulte as datas de validade dos materiais.', icon: CalendarDays },
    ],
  },
  {
    title: 'Movimentações',
    description: 'Acompanhe as entradas e transferências de materiais.',
    reports: [
      { key: 'entries', title: 'Histórico e Registro de Entradas', description: 'Consulte os registros de materiais recebidos.', icon: PackageOpen },
      { key: 'transfers', title: 'Histórico e Registro de Transferências / Saídas', description: 'Acompanhe os registros de saída de materiais.', icon: ArrowRightLeft },
    ],
  },
] satisfies { title: string; description: string; reports: { key: ReportKey; title: string; description: string; icon: typeof FileBarChart }[] }[]

export default function RelatoriosPage() {
  const [active, setActive] = useState<ReportKey | null>(null)
  const role = useAuthStore((state) => state.user?.role)

  return (
    <div className="flex-1 space-y-7 p-4 pt-6 md:p-8">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Relatórios &amp; Registros</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Consulte informações do estoque e das movimentações. Você também pode exportar os dados em PDF ou Excel.</p>
      </header>

      {role === 'ADMIN' && <Link href="/dashboard/relatorios/notificacoes" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:border-violet-200 hover:text-violet-700 focus-visible:outline-2 focus-visible:outline-violet-600"><Mail size={16} aria-hidden="true" />Notificações por e-mail</Link>}

      <div className="space-y-7">
        {reportGroups.map((group) => (
          <section key={group.title} aria-labelledby={group.title === 'Estoque' ? 'reports-stock' : 'reports-movements'}>
            <div className="mb-3">
              <h2 id={group.title === 'Estoque' ? 'reports-stock' : 'reports-movements'} className="text-base font-semibold text-slate-900">{group.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{group.description}</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {group.reports.map(({ key, title, description, icon: Icon }) => (
                <button key={key} type="button" onClick={() => setActive(key)} className="group flex w-full items-center gap-4 border-b border-slate-100 px-4 py-5 text-left transition-colors last:border-b-0 hover:bg-slate-50 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-violet-600 sm:px-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Icon size={19} aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold leading-5 text-slate-900">{title}</span><span className="mt-1 block text-sm leading-5 text-slate-600">{description}</span></span>
                  <span className="hidden shrink-0 text-xs font-medium text-violet-700 sm:inline">Consultar</span>
                  <ArrowRight size={17} className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-700" aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <InventoryReportDialog open={active === 'inventory'} onOpenChange={(v) => !v && setActive(null)} />
      <LowStockReportDialog open={active === 'low-stock'} onOpenChange={(v) => !v && setActive(null)} />
      <ExpiringReportDialog open={active === 'expiring'} onOpenChange={(v) => !v && setActive(null)} />
      <EntriesSummaryDialog open={active === 'entries'} onOpenChange={(v) => !v && setActive(null)} />
      <TransfersSummaryDialog open={active === 'transfers'} onOpenChange={(v) => !v && setActive(null)} />
    </div>
  )
}
