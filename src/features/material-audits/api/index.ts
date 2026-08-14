import { httpClient } from '@/infrastructure/http/client'
import { unwrapPage } from '@/shared/lib/pagination'
import type { PageLike, PageParams } from '@/shared/types/pagination'
import type {
  MaterialAudit,
  MaterialAuditDetails,
  CreateMaterialAuditPayload,
  UpdateMaterialAuditItemsPayload,
  AddAuditorsPayload,
  AuditStatus,
} from '../types'

export type MaterialAuditListParams = PageParams & {
  startDate?: string
  endDate?: string
  status?: AuditStatus
}

export const materialAuditsApi = {
  list: (params?: MaterialAuditListParams) =>
    httpClient
      .get<PageLike<MaterialAudit>>('/material-audits', { params })
      .then((r) => unwrapPage(r.data)),

  get: (id: string) =>
    httpClient
      .get<MaterialAuditDetails>(`/material-audits/${id}`)
      .then((r) => r.data),

  create: (data: CreateMaterialAuditPayload) =>
    httpClient
      .post<string>('/material-audits', data)
      .then((r) => r.data),

  updateItems: (id: string, data: UpdateMaterialAuditItemsPayload) =>
    httpClient.patch(`/material-audits/${id}/items`, data),

  finalize: (id: string) =>
    httpClient.patch(`/material-audits/${id}/finalize`),

  cancel: (id: string) =>
    httpClient.patch(`/material-audits/${id}/cancel`),

  addAuditors: (id: string, data: AddAuditorsPayload) =>
    httpClient.patch(`/material-audits/${id}/auditors`, data),

  exportPdf: (params?: MaterialAuditListParams) =>
    httpClient
      .get('/material-audits/export/pdf', { params, responseType: 'blob' })
      .then((r) => r.data),

  exportExcel: (params?: MaterialAuditListParams) =>
    httpClient
      .get('/material-audits/export/excel', { params, responseType: 'blob' })
      .then((r) => r.data),

  exportDetailsPdf: (id: string) =>
    httpClient
      .get(`/material-audits/${id}/export/pdf`, { responseType: 'blob' })
      .then((r) => r.data),

  exportDetailsExcel: (id: string) =>
    httpClient
      .get(`/material-audits/${id}/export/excel`, { responseType: 'blob' })
      .then((r) => r.data),
}
