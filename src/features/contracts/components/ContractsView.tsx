'use client'

import React, { useState } from 'react'
import { ContractsList } from './ContractsList'
import { ContractForm, type ContractFormMode } from './ContractForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Contract } from '../types'

const MOCK_COMPANIES = [
  { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'Odonto Corp' },
  { id: '77785f64-5717-4562-b3fc-2c963f66afa6', name: 'Fornecedora ABC' },
]

export function ContractsView() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<ContractFormMode>('create')
  const [selectedContract, setSelectedContract] = useState<Contract | undefined>()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [companyFilter, setCompanyFilter] = useState<string>('all')
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [viewContract, setViewContract] = useState<Contract | undefined>()

  const handleOpenCreate = () => {
    setFormMode('create')
    setSelectedContract(undefined)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (contract: Contract) => {
    setFormMode('edit')
    setSelectedContract(contract)
    setIsFormOpen(true)
  }

  const handleOpenRenew = (contract: Contract) => {
    setFormMode('renew')
    setSelectedContract(contract)
    setIsFormOpen(true)
  }

  const handleOpenView = (contract: Contract) => {
    setViewContract(contract)
    setIsViewOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Contratos</h2>
          <div className="md:hidden">
            <Button onClick={handleOpenCreate} className="gap-1.5 rounded-xl px-3 bg-brand hover:bg-brand/90 shrink-0" size="sm">
              <Plus size={15} />
              Novo Contrato
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar contrato..."
              className="pl-8 h-8 text-xs bg-white border-gray-200 shadow-sm rounded-lg w-full md:w-56"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="flex-1 min-w-0 h-8 text-xs bg-white border border-gray-200 shadow-sm rounded-lg px-2 outline-none text-slate-600 cursor-pointer"
            >
              <option value="all">Todas as Empresas</option>
              {MOCK_COMPANIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 min-w-0 h-8 text-xs bg-white border border-gray-200 shadow-sm rounded-lg px-2 outline-none text-slate-600 cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>
          </div>

          <div className="hidden md:block">
            <Button onClick={handleOpenCreate} className="gap-1.5 rounded-xl px-3 bg-brand hover:bg-brand/90 shrink-0" size="sm">
              <Plus size={15} />
              Novo Contrato
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <ContractsList 
          search={search} 
          statusFilter={statusFilter === 'all' ? null : statusFilter === 'true'}
          companyNameFilter={companyFilter === 'all' ? undefined : companyFilter}
          onView={handleOpenView} 
          onEdit={handleOpenEdit} 
          onRenew={handleOpenRenew} 
        />
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' && 'Novo Contrato'}
              {formMode === 'edit' && 'Editar Contrato'}
              {formMode === 'renew' && 'Renovar Contrato'}
            </DialogTitle>
            <DialogDescription>
              {formMode === 'create' && 'Preencha os dados abaixo para cadastrar um novo contrato.'}
              {formMode === 'edit' && 'Altere os dados necessários do contrato.'}
              {formMode === 'renew' && 'Renove a vigência. Isso inativará o contrato atual e criará um novo mantendo os vínculos.'}
            </DialogDescription>
          </DialogHeader>
          
          <ContractForm 
            mode={formMode}
            initialData={selectedContract}
            onSuccess={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Contrato</DialogTitle>
          </DialogHeader>
          
          {viewContract && (
            <div className="flex flex-col gap-4 text-sm mt-4">
              <div className="grid grid-cols-2 gap-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">Referência</span>
                  <span className="font-medium text-slate-800">{viewContract.referenceNumber}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-medium ${viewContract.status ? 'text-green-600' : 'text-red-500'}`}>
                    {viewContract.status ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">Data de Início</span>
                  <span className="font-medium text-slate-800">{new Date(viewContract.startDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">Data de Término</span>
                  <span className="font-medium text-slate-800">{new Date(viewContract.endDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {viewContract.companyName && (
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-gray-500">Empresa Vinculada</span>
                  <span className="font-medium text-slate-800">{viewContract.companyName}</span>
                </div>
              )}

              {viewContract.users && viewContract.users.length > 0 && (
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-gray-500">Fiscais (Usuários)</span>
                  <div className="flex flex-col gap-1 mt-1">
                    {viewContract.users.map(u => (
                      <span key={u.id} className="text-sm font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {u.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
