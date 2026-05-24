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
    <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-300">
      <OptionCard
        title="Relatório Geral de Materiais"
        icon={FileBarChart}
        iconColor="text-brand"
        onClick={() => setActive('inventory')}
      />
      <OptionCard
        title="Materiais em Falta"
        icon={TriangleAlert}
        iconColor="text-brand"
        onClick={() => setActive('low-stock')}
      />
      <OptionCard
        title="Vencimento de Materiais"
        icon={CalendarDays}
        iconColor="text-brand"
        titleColor="text-brand"
        onClick={() => setActive('expiring')}
      />
      <OptionCard
        title="Resumo de Entradas"
        icon={PackageOpen}
        iconColor="text-brand"
        onClick={() => setActive('entries')}
      />
      <OptionCard
        title="Resumo de Transferências"
        icon={ArrowRightLeft}
        iconColor="text-brand"
        onClick={() => setActive('transfers')}
      />

      <InventoryReportDialog open={active === 'inventory'} onOpenChange={(v) => !v && setActive(null)} />
      <LowStockReportDialog open={active === 'low-stock'} onOpenChange={(v) => !v && setActive(null)} />
      <ExpiringReportDialog open={active === 'expiring'} onOpenChange={(v) => !v && setActive(null)} />
      <EntriesSummaryDialog open={active === 'entries'} onOpenChange={(v) => !v && setActive(null)} />
      <TransfersSummaryDialog open={active === 'transfers'} onOpenChange={(v) => !v && setActive(null)} />
    </div>
  )
}
