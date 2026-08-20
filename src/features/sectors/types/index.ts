import type { EntityId } from '@/shared/types/id'

export type Sector = {
  id: EntityId
  name: string
  code: string
}

export type CreateSectorPayload = {
  name: string
  code: string
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
