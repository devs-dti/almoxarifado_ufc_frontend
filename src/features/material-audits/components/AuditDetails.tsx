'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, Save, CheckCircle, Ban, Download } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { materialAuditsApi } from '../api'
import {
  useMaterialAudit,
  useUpdateMaterialAuditItems,
  useFinalizeMaterialAudit,
  useCancelMaterialAudit,
} from '../hooks'
import type { MaterialAuditItemUpdatePayload, AuditStatus } from '../types'

interface Props {
  id: string
}

const statusMap: Record<AuditStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'warning' | 'success' | 'error' }> = {
  IN_PROGRESS: { label: 'Em Andamento', variant: 'warning' },
  FINALIZED: { label: 'Finalizada', variant: 'success' },
  CANCELED: { label: 'Cancelada', variant: 'error' },
}

export function AuditDetails({ id }: Props) {
  const router = useRouter()
  const { data: audit, isLoading, isError } = useMaterialAudit(id)
  
  const updateItems = useUpdateMaterialAuditItems()
  const finalizeAudit = useFinalizeMaterialAudit()
  const cancelAudit = useCancelMaterialAudit()

  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (audit && !isDirty) {
      const initialQuantities: Record<string, number> = {}
      audit.items.forEach(item => {
        initialQuantities[item.id] = item.physicalQuantity || 0
      })
      setQuantities(initialQuantities)
    }
  }, [audit, isDirty])

  if (isLoading) {
    return <div className="p-8 text-gray-500">Carregando detalhes...</div>
  }

  if (isError || !audit) {
    return <div className="p-8 text-destructive">Erro ao carregar auditoria.</div>
  }

  const status = statusMap[audit.status]
  const isFinalizedOrCanceled = audit.status === 'FINALIZED' || audit.status === 'CANCELED'

  function handleQuantityChange(itemId: string, value: string) {
    const num = parseFloat(value)
    if (isNaN(num)) return
    setQuantities(prev => ({ ...prev, [itemId]: num }))
    setIsDirty(true)
  }

  function handleSaveQuantities() {
    const payload: MaterialAuditItemUpdatePayload[] = Object.entries(quantities).map(([itemId, physicalQuantity]) => ({
      itemId,
      physicalQuantity
    }))

    updateItems.mutate({ id, data: { items: payload } }, {
      onSuccess: () => {
        toast.success('Quantidades atualizadas!')
        setIsDirty(false)
      },
      onError: () => toast.error('Erro ao atualizar quantidades.')
    })
  }

  function handleFinalize() {
    if (!confirm('Deseja realmente finalizar esta auditoria? Nenhuma outra alteração poderá ser feita.')) return
    finalizeAudit.mutate(id, {
      onSuccess: () => toast.success('Auditoria finalizada com sucesso!'),
      onError: () => toast.error('Erro ao finalizar auditoria.')
    })
  }

  function handleCancel() {
    if (!confirm('Deseja realmente cancelar esta auditoria?')) return
    cancelAudit.mutate(id, {
      onSuccess: () => toast.success('Auditoria cancelada com sucesso!'),
      onError: () => toast.error('Erro ao cancelar auditoria.')
    })
  }

  async function handleExportPdf() {
    try {
      const blob = await materialAuditsApi.exportDetailsPdf(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `auditoria-${id}.pdf`
      a.click()
    } catch (e) {
      toast.error('Erro ao exportar PDF')
    }
  }

  async function handleExportExcel() {
    try {
      const blob = await materialAuditsApi.exportDetailsExcel(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `auditoria-${id}.xlsx`
      a.click()
    } catch (e) {
      toast.error('Erro ao exportar Excel')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/auditorias')} className="shrink-0 h-10 w-10 p-0 rounded-full !bg-purple-100 text-gray-900 hover:!bg-purple-200 hover:text-black shadow-sm transition-colors">
          <ArrowLeft size={20} />
        </Button>
      </div>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex gap-4 items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Detalhes da Auditoria</h2>
              <Badge variant={status.variant} className="uppercase text-[10px]">{status.label}</Badge>
            </div>
            <p className="text-sm text-gray-500">
              Criado em: {format(new Date(audit.createdAt), "dd 'de' MMMM 'de' yyyy, 'às' HH:mm", { locale: ptBR })}
            </p>
            {audit.finishedAt && (
              <p className="text-sm text-gray-500">
                Finalizado em: {format(new Date(audit.finishedAt), "dd 'de' MMMM 'de' yyyy, 'às' HH:mm", { locale: ptBR })}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportPdf} className="gap-2">
            <Download size={14} /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-2">
            <Download size={14} /> Excel
          </Button>
          
          {!isFinalizedOrCanceled && (
            <>
              <Button variant="destructive" size="sm" onClick={handleCancel} className="gap-2">
                <Ban size={14} /> Cancelar
              </Button>
              <Button onClick={handleFinalize} className="gap-2 bg-brand hover:bg-brand/90" size="sm">
                <CheckCircle size={14} /> Finalizar Auditoria
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {audit.auditors && audit.auditors.length > 0 && (
          <div className="bg-white p-4 rounded-2xl border shadow-sm">
            <h3 className="font-semibold mb-3">Auditores Responsáveis</h3>
            <div className="flex flex-wrap gap-2">
              {audit.auditors.map(auditor => (
                <Badge key={auditor.id} variant="secondary">
                  {auditor.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50">
            <h3 className="font-semibold text-gray-700">Contagem Física dos Materiais</h3>
            {!isFinalizedOrCanceled && (
              <Button size="sm" onClick={handleSaveQuantities} disabled={!isDirty || updateItems.isPending} className="gap-2">
                <Save size={14} /> Salvar Quantidades
              </Button>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Material</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead className="text-center w-32">Qtd. Sistema</TableHead>
                <TableHead className="text-center w-40">Qtd. Física</TableHead>
                <TableHead className="text-center w-32">Diferença</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audit.items.map((item) => {
                const diff = (quantities[item.id] || 0) - item.systemQuantity
                const diffColor = diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-500'
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium pl-6">{item.materialName}</TableCell>
                    <TableCell>
                      {item.expirationType === 'DATED' && item.expirationDate
                        ? format(new Date(item.expirationDate), 'dd/MM/yyyy')
                        : item.expirationType === 'NON_EXPIRING'
                        ? 'Não Expira'
                        : 'Indefinido'}
                    </TableCell>
                    <TableCell className="text-center text-gray-500">
                      {item.systemQuantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {isFinalizedOrCanceled ? (
                        <span className="font-medium">{item.physicalQuantity}</span>
                      ) : (
                        <Input
                          type="number"
                          min={0}
                          value={quantities[item.id] ?? ''}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="w-24 text-center mx-auto"
                        />
                      )}
                    </TableCell>
                    <TableCell className={`text-center font-medium ${diffColor}`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
