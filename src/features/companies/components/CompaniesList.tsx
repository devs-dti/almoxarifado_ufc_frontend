'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Plus, Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useGetCompanies, useDeleteCompany } from '../api/useCompanies'
import { CompanyFormDialog } from './CompanyFormDialog'
import type { Company } from '../types'
import { useDebounceValue } from 'usehooks-ts'

export function CompaniesList() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search, 300)
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null)

  const { data: pageData, isLoading, isError } = useGetCompanies({
    page,
    size: 5,
    search: debouncedSearch || undefined,
  })

  const companies = pageData?.data || []
  const totalPages = pageData?.meta.totalPages || 0

  const deleteCompany = useDeleteCompany()

  const handleEdit = (company: Company) => {
    setCompanyToEdit(company)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setCompanyToEdit(null)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta empresa? A exclusão falhará se houver contratos ativos.')) {
      deleteCompany.mutate(id)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Empresas</h2>
          <div className="md:hidden">
            <Button onClick={handleCreate} className="gap-1.5 rounded-xl px-3 bg-brand hover:bg-brand/90 shrink-0" size="sm">
              <Plus size={15} />
              Nova Empresa
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <Input 
              placeholder="Buscar por SEI ou Nome..." 
              className="pl-8 h-8 rounded-lg text-xs bg-white border-gray-200 shadow-sm w-full"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            />
          </div>
          <div className="hidden md:block">
            <Button onClick={handleCreate} className="gap-1.5 rounded-xl px-3 bg-brand hover:bg-brand/90 shrink-0" size="sm">
              <Plus size={15} />
              Nova Empresa
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-sm text-red-500 py-8">
          Erro ao carregar empresas.
        </p>
      )}

      {!isLoading && !isError && companies.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Nenhuma empresa encontrada.
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-4">
        {!isLoading && companies.map((company) => (
          <div
            key={company.id}
            className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-slate-800">
                {company.name}
              </span>
              <span className="text-[13px] text-slate-500 mt-1">
                SEI: <span className="font-medium text-slate-700">{company.sei}</span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleEdit(company)}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="Editar"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(company.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Excluir"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-500">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <CompanyFormDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        company={companyToEdit}
      />
    </div>
  )
}
