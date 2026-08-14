// Force TS Server Reload
'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contractSchema, type ContractFormData } from '../schemas'
import { useCreateContract, useUpdateContract, useRenewContract } from '../api/useContracts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Contract } from '../types'

// Mocks temporários para popular os selects
const MOCK_COMPANIES = [
  { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'Odonto Corp' },
  { id: '77785f64-5717-4562-b3fc-2c963f66afa6', name: 'Fornecedora ABC' },
]

const MOCK_USERS = [
  { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'João Admin' },
  { id: '55585f64-5717-4562-b3fc-2c963f66afa6', name: 'Maria Fiscal' },
]

export type ContractFormMode = 'create' | 'edit' | 'renew'

interface ContractFormProps {
  mode?: ContractFormMode;
  initialData?: Contract;
  onSuccess?: () => void;
}

export function ContractForm({ mode = 'create', initialData, onSuccess }: ContractFormProps) {
  const createContract = useCreateContract()
  const updateContract = useUpdateContract()
  const renewContract = useRenewContract()

  // No modo renew, preenchemos apenas empresa e usuários (desabilitados) 
  const getDefaults = (): ContractFormData => {
    if (mode === 'renew' && initialData) {
      return {
        referenceNumber: '',
        startDate: '',
        endDate: '',
        status: true,
        companyId: '',
        userIds: initialData.userIds,
      }
    }
    if (initialData) {
      return {
        referenceNumber: initialData.referenceNumber,
        startDate: initialData.startDate.slice(0, 16), // datetime-local format
        endDate: initialData.endDate.slice(0, 16),
        status: initialData.status,
        companyId: '',
        userIds: initialData.userIds,
      }
    }
    return {
      referenceNumber: '',
      startDate: '',
      endDate: '',
      status: true,
      companyId: '',
      userIds: [],
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: getDefaults()
  })

  const isPending = createContract.isPending || updateContract.isPending || renewContract.isPending

  const onSubmit = (data: ContractFormData) => {
    if (mode === 'edit' && initialData) {
      updateContract.mutate({ id: initialData.id, data }, { onSuccess: () => onSuccess?.() })
    } else if (mode === 'renew' && initialData) {
      renewContract.mutate({ 
        id: initialData.id, 
        data: { referenceNumber: data.referenceNumber, startDate: data.startDate, endDate: data.endDate } 
      }, { onSuccess: () => onSuccess?.() })
    } else {
      createContract.mutate(data, { onSuccess: () => onSuccess?.() })
    }
  }

  // Renovar desabilita edição de empresa e usuários (pois eles são herdados)
  const disableRelations = mode === 'renew'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <div className="space-y-2">
        <Label htmlFor="referenceNumber">Número de Referência</Label>
        <Input 
          id="referenceNumber" 
          placeholder="Ex: CTR-001" 
          {...register('referenceNumber')} 
        />
        {errors.referenceNumber && (
          <p className="text-sm text-red-500">{errors.referenceNumber.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Data de Início</Label>
          <Input 
            id="startDate" 
            type="datetime-local"
            {...register('startDate')} 
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Data de Término</Label>
          <Input 
            id="endDate" 
            type="datetime-local"
            {...register('endDate')} 
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyId">Empresa Vinculada</Label>
        <select 
          id="companyId" 
          disabled={disableRelations}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register('companyId')}
        >
          <option value="">Selecione uma empresa</option>
          {MOCK_COMPANIES.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.companyId && (
          <p className="text-sm text-red-500">{errors.companyId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="userIds">Usuários (Fiscais)</Label>
        <select 
          id="userIds" 
          multiple
          disabled={disableRelations}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register('userIds')}
        >
          {MOCK_USERS.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <p className="text-xs text-slate-500">Pressione Ctrl/Cmd para selecionar mais de um</p>
        {errors.userIds && (
          <p className="text-sm text-red-500">{errors.userIds.message}</p>
        )}
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Salvar Contrato'}
        </Button>
      </div>

    </form>
  )
}
