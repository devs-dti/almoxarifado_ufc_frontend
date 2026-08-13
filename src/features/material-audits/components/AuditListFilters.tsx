'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AuditStatus } from '../types'
import { PdfIcon, ExcelIcon } from './ExportIcons'

interface AuditListFiltersProps {
  startDate: string
  endDate: string
  statusFilter: AuditStatus | ''
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onStatusFilterChange: (status: AuditStatus | '') => void
  onClearFilters: () => void
  onExportPdf: () => void
  onExportExcel: () => void
}

export function AuditListFilters({
  startDate,
  endDate,
  statusFilter,
  onStartDateChange,
  onEndDateChange,
  onStatusFilterChange,
  onClearFilters,
  onExportPdf,
  onExportExcel,
}: AuditListFiltersProps) {
  const hasFilters = startDate || endDate || statusFilter

  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-800">Filtros de Busca</h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
        <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
          <label className="text-xs font-medium text-gray-500">Data Inicial</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
          <label className="text-xs font-medium text-gray-500">Data Final</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
          <label className="text-xs font-medium text-gray-500">Status</label>
          <Select
            value={statusFilter}
            onValueChange={(v) => onStatusFilterChange(v as AuditStatus | '')}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
              <SelectItem value="FINALIZED">Finalizada</SelectItem>
              <SelectItem value="CANCELED">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-9 gap-1.5 text-gray-400 hover:text-gray-700 shrink-0"
          >
            <X size={14} /> Limpar
          </Button>
        )}

        <div className="flex flex-col gap-1.5 shrink-0 ml-auto sm:ml-2">
          <label className="text-xs font-medium text-gray-500">Downloads</label>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onExportPdf} className="h-9 gap-2 shrink-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
              <PdfIcon className="text-lg" /> {hasFilters ? 'PDF (Filtrado)' : 'PDF'}
            </Button>
            <Button variant="outline" size="sm" onClick={onExportExcel} className="h-9 gap-2 shrink-0 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700">
              <ExcelIcon className="text-lg" /> {hasFilters ? 'Excel (Filtrado)' : 'Excel'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
