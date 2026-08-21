'use client'

import { useState } from 'react'
import { FileBarChart, TriangleAlert, CalendarDays, PackageOpen, ArrowRightLeft } from 'lucide-react'
import { OptionCard } from '@/components/ui/option-card'
import { InventoryReportDialog } from '@/features/reports/components/InventoryReportDialog'
import { LowStockReportDialog } from '@/features/reports/components/LowStockReportDialog'
import { ExpiringReportDialog } from '@/features/reports/components/ExpiringReportDialog'
import { EntriesSummaryDialog } from '@/features/reports/components/EntriesSummaryDialog'
import { TransfersSummaryDialog } from '@/features/reports/components/TransfersSummaryDialog'

type ReportKey = 'inventory' | 'low-stock' | 'expiring' | 'entries' | 'transfers' | null

export default function RelatoriosPage() {
  const [active, setActive] = useState<ReportKey>(null)

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Relatórios & Registros</h2>
          <p className="text-sm text-gray-500 mt-1">
            Consulte o histórico de movimentações, validades e exporte dados em PDF ou Excel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <OptionCard
          title="Relação Geral de Itens em Estoque"
          icon={FileBarChart}
          iconColor="text-brand"
          onClick={() => setActive('inventory')}
        />
        <OptionCard
          title="Materiais com Estoque Zerado ou Baixo"
          icon={TriangleAlert}
          iconColor="text-amber-500"
          onClick={() => setActive('low-stock')}
        />
        <OptionCard
          title="Controle de Vencimentos por Lote"
          icon={CalendarDays}
          iconColor="text-purple-600"
          onClick={() => setActive('expiring')}
        />
        <OptionCard
          title="Histórico e Registro de Entradas"
          icon={PackageOpen}
          iconColor="text-emerald-600"
          onClick={() => setActive('entries')}
        />
        <OptionCard
          title="Histórico e Registro de Transferências / Saídas"
          icon={ArrowRightLeft}
          iconColor="text-blue-600"
          onClick={() => setActive('transfers')}
        />
      </div>

      <InventoryReportDialog open={active === 'inventory'} onOpenChange={(v) => !v && setActive(null)} />
      <LowStockReportDialog open={active === 'low-stock'} onOpenChange={(v) => !v && setActive(null)} />
      <ExpiringReportDialog open={active === 'expiring'} onOpenChange={(v) => !v && setActive(null)} />
      <EntriesSummaryDialog open={active === 'entries'} onOpenChange={(v) => !v && setActive(null)} />
      <TransfersSummaryDialog open={active === 'transfers'} onOpenChange={(v) => !v && setActive(null)} />
    </div>
  )
}
