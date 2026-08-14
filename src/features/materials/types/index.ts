import type { EntityId } from '@/shared/types/id'

export type MaterialGroup = {
  id: EntityId
  name: string
  deletedAt?: string | null
}

export type MeasurementUnit = {
  id: EntityId
  name: string
  abbreviation: string
  deletedAt?: string | null
}

export type Material = {
  id: EntityId
  name: string
  code: string
  quantity: number
  minQuantity: number
  group: MaterialGroup
  unit: MeasurementUnit
  deletedAt?: string | null
}

export type CreateMaterialPayload = {
  name: string
  code: string
  minQuantity: number
  groupId: EntityId
  unitId: EntityId
}

export type UpdateMaterialPayload = Partial<CreateMaterialPayload>
