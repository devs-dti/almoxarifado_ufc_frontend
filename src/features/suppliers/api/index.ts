import { httpClient as api } from '@/infrastructure/http/client'
import type { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '../types'

export const suppliersApi = {
  list: () => api.get<Supplier[]>('/suppliers').then((r) => r.data),
  get: (id: number) => api.get<Supplier>(`/suppliers/${id}`).then((r) => r.data),
  create: (data: CreateSupplierPayload) => api.post<Supplier>('/suppliers', data).then((r) => r.data),
  update: (id: number, data: UpdateSupplierPayload) => api.patch<Supplier>(`/suppliers/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/suppliers/${id}`),
}
