import { httpClient as api } from '@/infrastructure/http/client'
import { unwrapPage } from '@/shared/lib/pagination'
import type { EntityId } from '@/shared/types/id'
import type { PageLike, PageParams } from '@/shared/types/pagination'
import type { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '../types'

export const suppliersApi = {
  list: (params?: PageParams & { search?: string }) =>
    api.get<PageLike<Supplier>>('/suppliers', { params }).then((r) => unwrapPage(r.data).content),
  get: (id: EntityId) => api.get<Supplier>(`/suppliers/${id}`).then((r) => r.data),
  create: (data: CreateSupplierPayload) => api.post<Supplier>('/suppliers', data).then((r) => r.data),
  update: (id: EntityId, data: UpdateSupplierPayload) => api.patch<Supplier>(`/suppliers/${id}`, data).then((r) => r.data),
  delete: (id: EntityId) => api.delete(`/suppliers/${id}`),
}
