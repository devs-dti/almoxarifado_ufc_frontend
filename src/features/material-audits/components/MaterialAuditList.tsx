'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { useMaterialAudits } from '../hooks'
import { materialAuditsApi } from '../api'
import { CreateAuditDialog } from './CreateAuditDialog'
import { AuditListFilters } from './AuditListFilters'
import { AuditListTable } from './AuditListTable'
import type { AuditStatus } from '../types'

const PAGE_SIZE = 10

export function MaterialAuditList() {
  const [page, setPage] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [statusFilter, setStatusFilter] = useState<AuditStatus | ''>('')

  const { data: pageData, isLoading, isError } = useMaterialAudits({
    page,
    size: PAGE_SIZE,
    sort: 'createdAt,desc',
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(statusFilter && { status: statusFilter as AuditStatus }),
  })

  const audits = pageData?.data || []
  const totalPages = pageData?.meta.totalPages || 0

  function clearFilters() {
    setStartDate('')
    setEndDate('')
    setStatusFilter('')
    setPage(0)
  }

  function getExportParams() {
    return {
      page: 0,
      size: 1000,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(statusFilter && { status: statusFilter as AuditStatus }),
    }
  }

  async function handleExportPdf() {
    try {
      const blob = await materialAuditsApi.exportPdf(getExportParams())
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `auditorias-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      a.click()
    } catch (e) {
      console.error('Erro ao exportar PDF', e)
    }
  }

  async function handleExportExcel() {
    try {
      const blob = await materialAuditsApi.exportExcel(getExportParams())
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `auditorias-${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      a.click()
    } catch (e) {
      console.error('Erro ao exportar Excel', e)
    }
  }

  async function handleExportIndividualPdf(id: string) {
    try {
      const blob = await materialAuditsApi.exportDetailsPdf(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `auditoria-${id.slice(0, 8)}.pdf`
      a.click()
    } catch (e) {
      console.error('Erro ao exportar PDF individual', e)
    }
  }

  async function handleExportIndividualExcel(id: string) {
    try {
      const blob = await materialAuditsApi.exportDetailsExcel(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `auditoria-${id.slice(0, 8)}.xlsx`
      a.click()
    } catch (e) {
      console.error('Erro ao exportar Excel individual', e)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Auditorias de Materiais</h2>
          <p className="text-sm text-gray-500">Gerencie e visualize as auditorias de estoque.</p>
        </div>
        <div className="flex items-center gap-3">
          <CreateAuditDialog />
        </div>
      </div>

      {/* Filters */}
      <AuditListFilters 
        startDate={startDate}
        endDate={endDate}
        statusFilter={statusFilter}
        onStartDateChange={(val) => { setStartDate(val); setPage(0) }}
        onEndDateChange={(val) => { setEndDate(val); setPage(0) }}
        onStatusFilterChange={(val) => { setStatusFilter(val); setPage(0) }}
        onClearFilters={clearFilters}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
      />

      {/* Table */}
      <AuditListTable 
        audits={audits}
        isLoading={isLoading}
        isError={isError}
        onExportIndividualPdf={handleExportIndividualPdf}
        onExportIndividualExcel={handleExportIndividualExcel}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </Button>
          <span className="text-sm text-gray-500">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}
    </div>
  )
}



