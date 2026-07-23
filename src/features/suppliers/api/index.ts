import { httpClient as api } from '@/infrastructure/http/client'
import type { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '../types'

export const suppliersApi = {
  list: (): Promise<Supplier[]> => api.get<any>('/suppliers').then((r) => Array.isArray(r.data) ? r.data : (r.data?.content ?? [])),
  get: (id: string) => api.get<Supplier>(`/suppliers/${id}`).then((r) => r.data),
  create: (data: CreateSupplierPayload) => api.post<Supplier>('/suppliers', data).then((r) => r.data),
  update: (id: string, data: UpdateSupplierPayload) => api.patch<Supplier>(`/suppliers/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/suppliers/${id}`),
}
