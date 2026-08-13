'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Eye } from 'lucide-react'
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
import { PdfIcon, ExcelIcon } from './ExportIcons'
import type { MaterialAudit, AuditStatus } from '../types'

const statusMap: Record<AuditStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  IN_PROGRESS: { label: 'Em Andamento', variant: 'default' },
  FINALIZED: { label: 'Finalizada', variant: 'secondary' },
  CANCELED: { label: 'Cancelada', variant: 'destructive' },
}

interface AuditListTableProps {
  audits: MaterialAudit[]
  isLoading: boolean
  isError: boolean
  onExportIndividualPdf: (id: string) => void
  onExportIndividualExcel: (id: string) => void
}

export function AuditListTable({
  audits,
  isLoading,
  isError,
  onExportIndividualPdf,
  onExportIndividualExcel,
}: AuditListTableProps) {
  const router = useRouter()

  return (
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
                    <Button variant="ghost" size="sm" onClick={() => onExportIndividualPdf(audit.id)} className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 hover:text-red-700" title="Baixar PDF">
                      <PdfIcon className="text-lg" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onExportIndividualExcel(audit.id)} className="h-9 w-9 p-0 text-green-600 hover:bg-green-50 hover:text-green-700" title="Baixar Excel">
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
  )
}
