import type { MaterialGroup } from '@/features/material-groups/types'
import type { EntityId } from '@/shared/types/id'

export type { MaterialGroup }

export type MeasurementUnit = {
  id: EntityId
  name: string
  abbreviation: string
  deletedAt?: string | null
}

export type Material = {
  id: EntityId
  name: string
  internalCode: string
  description?: string | null
  imageUrl?: string | null
  minQuantity: number
  materialGroupName: string
  measurementUnitName: string
  deletedAt?: string | null
}

export type CreateMaterialPayload = {
  name: string
  internalCode: string
  description?: string
  minQuantity: number
  materialGroupId: EntityId
  measurementUnitId: EntityId
  file?: File
}

export type UpdateMaterialPayload = Partial<CreateMaterialPayload>
