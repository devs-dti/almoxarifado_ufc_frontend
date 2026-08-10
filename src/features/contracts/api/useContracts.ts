import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient as api } from '@/infrastructure/http/client'
import type { Contract, ContractDTO } from '../types'
import type { PaginatedResponse, PageParams } from '@/shared/types/pagination'

type ContractsPageParams = PageParams & {
  search?: string
  status?: boolean
  companyName?: string
}

// ---------------------------------------------------------
// Axios requests
// ---------------------------------------------------------
export const contractsApi = {
  list: (params?: ContractsPageParams) =>
    api.get<PaginatedResponse<Contract>>('/contracts', { params }).then((r) => r.data),
  
  getById: (id: string) =>
    api.get<Contract>(`/contracts/${id}`).then((r) => r.data),
    
  create: (data: ContractDTO) =>
    api.post<Contract>('/contracts', data).then((r) => r.data),
    
  renew: (id: string, data: { referenceNumber: string, startDate: string, endDate: string }) =>
    api.post<Contract>(`/contracts/${id}/renew`, data).then((r) => r.data),
    
  update: (id: string, data: Partial<ContractDTO>) =>
    api.patch<Contract>(`/contracts/${id}`, data).then((r) => r.data),
    
  delete: (id: string) => 
    api.delete(`/contracts/${id}`),
}

// ---------------------------------------------------------
// React Query Hooks
// ---------------------------------------------------------
export const contractsKeys = {
  all: ['contracts'] as const,
  list: (params?: object) => ['contracts', 'list', params] as const,
  detail: (id: string) => ['contracts', 'detail', id] as const,
}

export function useGetContracts(params?: ContractsPageParams) {
  return useQuery({
    queryKey: contractsKeys.list(params),
    queryFn: () => contractsApi.list(params),
  })
}

export function useGetContract(id: string) {
  return useQuery({
    queryKey: contractsKeys.detail(id),
    queryFn: () => contractsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ContractDTO) => contractsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contractsKeys.all })
    },
  })
}

export function useRenewContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { referenceNumber: string, startDate: string, endDate: string } }) => 
      contractsApi.renew(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contractsKeys.all })
    },
  })
}

export function useUpdateContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContractDTO> }) => 
      contractsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contractsKeys.all })
    },
  })
}

export function useDeleteContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => contractsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contractsKeys.all })
    },
  })
}
