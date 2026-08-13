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
      <div className="flex flex-wrap items-end gap-3">
        <div className="grid grid-cols-2 gap-3 w-full lg:flex lg:flex-1 lg:w-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Data Inicial</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Data Final</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5 col-span-2 lg:col-span-1 lg:min-w-[150px]">
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
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-9 gap-1.5 text-gray-400 hover:text-gray-700 w-full lg:w-auto"
          >
            <X size={14} /> Limpar Filtros
          </Button>
        )}

        <div className="flex flex-col gap-1.5 w-full lg:w-auto lg:ml-auto mt-2 lg:mt-0 pt-3 lg:pt-0 border-t lg:border-0 border-gray-100">
          <label className="text-xs font-medium text-gray-500 hidden lg:block">Downloads</label>
          <div className="grid grid-cols-2 lg:flex lg:items-center gap-3">
            <Button variant="outline" size="sm" onClick={onExportPdf} className="h-9 gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 w-full">
              <PdfIcon className="text-lg" /> 
              <span className="hidden sm:inline">{hasFilters ? 'PDF (Filtrado)' : 'PDF'}</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onExportExcel} className="h-9 gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 w-full">
              <ExcelIcon className="text-lg" /> 
              <span className="hidden sm:inline">{hasFilters ? 'Excel (Filtrado)' : 'Excel'}</span>
              <span className="sm:hidden">Excel</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
