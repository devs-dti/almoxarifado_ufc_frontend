// Force TS Server Reload
'use client'

import React from 'react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useGetContracts, useDeleteContract } from '../api/useContracts'
import type { Contract } from '../types'

interface ContractsListProps {
  search: string;
  statusFilter?: boolean | null;
  companyNameFilter?: string;
  onView?: (contract: Contract) => void;
  onEdit?: (contract: Contract) => void;
  onRenew?: (contract: Contract) => void;
}

const PAGE_SIZE = 5

export function ContractsList({ search, statusFilter, companyNameFilter, onView, onEdit, onRenew }: ContractsListProps) {
  const [page, setPage] = React.useState(0)
  
  React.useEffect(() => {
    setPage(0)
  }, [search, statusFilter, companyNameFilter])

  const { data: pageData, isLoading, error } = useGetContracts({ 
    page, 
    size: PAGE_SIZE, 
    search, 
    status: statusFilter !== null ? statusFilter : undefined,
    companyName: companyNameFilter || undefined
  })
  const deleteContract = useDeleteContract()

  if (isLoading) return <div className="p-4 text-center text-slate-500">Carregando contratos...</div>
  if (error) return <div className="p-4 text-center text-red-500">Erro ao carregar contratos.</div>

  const contracts = pageData?.content || []
  const totalPages = pageData?.totalPages || 0

  return (
    <div className="flex flex-col gap-6">
      {contracts.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-gray-100 shadow-sm mt-2">
          Nenhum contrato encontrado.
        </div>
      ) : (
        contracts.map((contract) => (
          <div 
            key={contract.id} 
            onClick={() => onView?.(contract)}
            className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
              {contract.referenceNumber}
              <Badge 
                variant="secondary" 
                className={`text-[10px] h-5 px-1.5 ${contract.status ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}`}
              >
                {contract.status ? "Ativo" : "Inativo"}
              </Badge>
            </span>
            <span className="text-[13px] text-slate-500 mt-1">
              Vigência: {format(new Date(contract.startDate), 'dd/MM/yyyy')} até {format(new Date(contract.endDate), 'dd/MM/yyyy')}
            </span>
            {contract.companyName && (
              <span className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1">
                Empresa: <span className="font-medium text-slate-700">{contract.companyName}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRenew?.(contract)
              }}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Renovar"
            >
              <RotateCw size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(contract)
              }}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Editar"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteContract.mutate(contract.id)
              }}
              disabled={contract.status || deleteContract.isPending}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      )))}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-slate-500 font-medium">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
            aria-label="Próxima página"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
