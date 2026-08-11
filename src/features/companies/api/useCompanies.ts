import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient as api } from '@/infrastructure/http/client'
import type { Company, CompanyDTO } from '../types'
import type { PaginatedResponse, PageParams } from '@/shared/types/pagination'

type CompaniesPageParams = PageParams & {
  search?: string
}

// ---------------------------------------------------------
// Axios requests
// ---------------------------------------------------------
export const companiesApi = {
  list: (params?: CompaniesPageParams) =>
    api.get<PaginatedResponse<Company>>('/companies', { params }).then((r) => r.data),
  
  getById: (id: string) =>
    api.get<Company>(`/companies/${id}`).then((r) => r.data),
    
  create: (data: CompanyDTO) =>
    api.post<Company>('/companies', data).then((r) => r.data),
    
  update: (id: string, data: Partial<CompanyDTO>) =>
    api.patch<Company>(`/companies/${id}`, data).then((r) => r.data),
    
  delete: (id: string) => 
    api.delete(`/companies/${id}`),
}

// ---------------------------------------------------------
// React Query Hooks
// ---------------------------------------------------------
export const companiesKeys = {
  all: ['companies'] as const,
  list: (params?: object) => ['companies', 'list', params] as const,
  detail: (id: string) => ['companies', 'detail', id] as const,
}

export function useGetCompanies(params?: CompaniesPageParams) {
  return useQuery({
    queryKey: companiesKeys.list(params),
    queryFn: () => companiesApi.list(params),
  })
}

export function useGetCompany(id: string) {
  return useQuery({
    queryKey: companiesKeys.detail(id),
    queryFn: () => companiesApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CompanyDTO) => companiesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companiesKeys.all })
    },
  })
}

export function useUpdateCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CompanyDTO> }) => 
      companiesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companiesKeys.all })
    },
  })
}

export function useDeleteCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => companiesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companiesKeys.all })
    },
  })
}
