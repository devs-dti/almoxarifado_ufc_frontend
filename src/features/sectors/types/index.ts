import type { EntityId } from '@/shared/types/id'

export type Sector = {
  id: EntityId
  name: string
  description?: string
  deletedAt?: string | null
}

export type CreateSectorPayload = {
  name: string
  description?: string
}

export type UpdateSectorPayload = Partial<CreateSectorPayload>

export type MeasurementUnit = {
  id: EntityId
  name: string
  abbreviation: string
  deletedAt?: string | null
}

export type CreateMeasurementUnitPayload = {
  name: string
  abbreviation: string
}

export type UpdateMeasurementUnitPayload = Partial<CreateMeasurementUnitPayload>
