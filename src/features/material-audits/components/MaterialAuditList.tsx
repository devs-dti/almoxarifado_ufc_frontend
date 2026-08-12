'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Download, Eye, X } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useMaterialAudits } from '../hooks'
import { materialAuditsApi } from '../api'
import { CreateAuditDialog } from './CreateAuditDialog'
import type { AuditStatus } from '../types'

const PAGE_SIZE = 10

const statusMap: Record<AuditStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  IN_PROGRESS: { label: 'Em Andamento', variant: 'default' },
  FINALIZED: { label: 'Finalizada', variant: 'secondary' },
  CANCELED: { label: 'Cancelada', variant: 'destructive' },
}

export function MaterialAuditList() {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [statusFilter, setStatusFilter] = useState<AuditStatus | ''>('')

  const hasFilters = startDate || endDate || statusFilter

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Auditorias de Materiais</h2>
          <p className="text-sm text-gray-500">Gerencie e visualize as auditorias de estoque.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportPdf} className="gap-2">
            <Download size={14} /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-2">
            <Download size={14} /> Excel
          </Button>
          <CreateAuditDialog />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 bg-white border rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
          <label className="text-xs font-medium text-gray-500">Data Inicial</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(0) }}
            className="h-9 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
          <label className="text-xs font-medium text-gray-500">Data Final</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(0) }}
            className="h-9 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
          <label className="text-xs font-medium text-gray-500">Status</label>
          <Select
            value={statusFilter}
            onValueChange={(v) => { setStatusFilter(v as AuditStatus | ''); setPage(0) }}
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
            onClick={clearFilters}
            className="h-9 gap-1.5 text-gray-400 hover:text-gray-700 shrink-0"
          >
            <X size={14} /> Limpar
          </Button>
        )}
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Data de Criação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Finalizada Em</TableHead>
              <TableHead className="text-right pr-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && audits.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                  Nenhuma auditoria encontrada.
                </TableCell>
              </TableRow>
            )}
            {audits.map((audit) => {
              const status = statusMap[audit.status]
              return (
                <TableRow key={audit.id}>
                  <TableCell className="pl-6">
                    {format(new Date(audit.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant} className="text-[10px] uppercase">
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {audit.finishedAt
                      ? format(new Date(audit.finishedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/auditorias/${audit.id}`)} className="h-10 w-10 p-0 text-gray-500 hover:text-brand">
                      <Eye size={20} />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

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

