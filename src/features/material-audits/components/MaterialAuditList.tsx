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

const PdfIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor" className={className}>
    <path d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"/>
  </svg>
)

const ExcelIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor" className={className}>
    <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM155.7 250.2L192 302.5l36.3-52.3c7.6-10.9 22.8-13.6 33.6-6s13.6 22.8 6 33.6l-55.1 79.4 55.1 79.4c7.6 10.9 4.9 26.1-6 33.6s-26.1 4.9-33.6-6L192 412.5l-36.3 52.3c-7.6 10.9-22.8 13.6-33.6 6s-13.6-22.8-6-33.6l55.1-79.4-55.1-79.4c-7.6-10.9-4.9-26.1 6-33.6s26.1-4.9 33.6 6z"/>
  </svg>
)

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Auditorias de Materiais</h2>
          <p className="text-sm text-gray-500">Gerencie e visualize as auditorias de estoque.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <CreateAuditDialog />
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white border rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-800">Filtros de Busca e Download</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
            <label className="text-xs font-medium text-gray-500">Data Inicial</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(0) }}
              className="h-9 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
            <label className="text-xs font-medium text-gray-500">Data Final</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(0) }}
              className="h-9 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
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

          {/* Separator */}
          <div className="hidden sm:block w-px h-9 bg-gray-200 mx-1" />

          {/* Export Actions */}
          <Button variant="outline" size="sm" onClick={handleExportPdf} className="h-9 gap-2 shrink-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
            <PdfIcon className="text-lg" /> {hasFilters ? 'PDF (Filtrado)' : 'PDF'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="h-9 gap-2 shrink-0 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700">
            <ExcelIcon className="text-lg" /> {hasFilters ? 'Excel (Filtrado)' : 'Excel'}
          </Button>
        </div>
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
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleExportIndividualPdf(audit.id)} className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 hover:text-red-700" title="Baixar PDF">
                        <PdfIcon className="text-lg" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleExportIndividualExcel(audit.id)} className="h-9 w-9 p-0 text-green-600 hover:bg-green-50 hover:text-green-700" title="Baixar Excel">
                        <ExcelIcon className="text-lg" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/auditorias/${audit.id}`)} className="h-9 w-9 p-0 text-gray-400 hover:bg-gray-100 hover:text-brand" title="Ver Detalhes">
                        <Eye size={20} />
                      </Button>
                    </div>
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


