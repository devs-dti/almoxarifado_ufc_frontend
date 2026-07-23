import { httpClient as api } from '@/infrastructure/http/client'
import type { Sector, CreateSectorPayload, UpdateSectorPayload, MeasurementUnit, CreateMeasurementUnitPayload, UpdateMeasurementUnitPayload } from '../types'

export const sectorsApi = {
  list: (): Promise<Sector[]> => api.get<any>('/sectors').then((r) => Array.isArray(r.data) ? r.data : (r.data?.content ?? [])),
  create: (data: CreateSectorPayload) => api.post<Sector>('/sectors', data).then((r) => r.data),
  update: (id: string, data: UpdateSectorPayload) => api.patch<Sector>(`/sectors/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/sectors/${id}`),
}

export const unitsApi = {
  list: (): Promise<MeasurementUnit[]> => api.get<any>('/measurement-units').then((r) => Array.isArray(r.data) ? r.data : (r.data?.content ?? [])),
  create: (data: CreateMeasurementUnitPayload) => api.post<MeasurementUnit>('/measurement-units', data).then((r) => r.data),
  update: (id: string, data: UpdateMeasurementUnitPayload) => api.patch<MeasurementUnit>(`/measurement-units/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/measurement-units/${id}`),
}
