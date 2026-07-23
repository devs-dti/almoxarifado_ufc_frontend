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

const reports = [
  {
    key: 'inventory' as ReportKey,
    title: 'Relatório Geral de Materiais',
    icon: FileBarChart,
    iconColor: 'text-brand',
    iconBg: 'bg-violet-50',
  },
  {
    key: 'low-stock' as ReportKey,
    title: 'Materiais em Falta',
    icon: TriangleAlert,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
  },
  {
    key: 'expiring' as ReportKey,
    title: 'Vencimento de Materiais',
    icon: CalendarDays,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
  },
  {
    key: 'entries' as ReportKey,
    title: 'Resumo de Entradas',
    icon: PackageOpen,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
  },
  {
    key: 'transfers' as ReportKey,
    title: 'Resumo de Transferências',
    icon: ArrowRightLeft,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
  },
]

export default function RelatoriosPage() {
  const [active, setActive] = useState<ReportKey>(null)

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Relatórios</h2>
      </div>

      {reports.map((r, i) => (
        <div key={r.key as string} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
          <OptionCard
            title={r.title}
            icon={r.icon}
            iconColor={r.iconColor}
            iconBg={r.iconBg}
            onClick={() => setActive(r.key)}
          />
        </div>
      ))}

      <InventoryReportDialog open={active === 'inventory'} onOpenChange={(v) => !v && setActive(null)} />
      <LowStockReportDialog open={active === 'low-stock'} onOpenChange={(v) => !v && setActive(null)} />
      <ExpiringReportDialog open={active === 'expiring'} onOpenChange={(v) => !v && setActive(null)} />
      <EntriesSummaryDialog open={active === 'entries'} onOpenChange={(v) => !v && setActive(null)} />
      <TransfersSummaryDialog open={active === 'transfers'} onOpenChange={(v) => !v && setActive(null)} />
    </div>
  )
}
