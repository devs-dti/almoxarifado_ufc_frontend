'use client'

import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
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

  const { data: pageData, isLoading, isError } = useMaterialAudits({
    page,
    size: PAGE_SIZE,
    sort: 'createdAt,desc'
  })

  const audits = pageData?.data || []
  const totalPages = pageData?.meta.totalPages || 0

  async function handleExportPdf() {
    try {
      const blob = await materialAuditsApi.exportPdf({ page: 0, size: 1000 })
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
      const blob = await materialAuditsApi.exportExcel({ page: 0, size: 1000 })
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

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Finalizada Em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
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
                  <TableCell>
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
                  <TableCell className="text-right">
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
