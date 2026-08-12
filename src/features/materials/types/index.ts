import type { MaterialGroup } from '@/features/material-groups/types'

export type MeasurementUnit = {
  id: number
  name: string
  abbreviation: string
  deletedAt?: string | null
}

export type Material = {
  id: number
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
  groupId: string
  unitId: number
}

export type UpdateMaterialPayload = Partial<CreateMaterialPayload>

export type MaterialMovement = {
  id: number
  type: 'ENTRY' | 'TRANSFER'
  quantity: number
  date: string
  referenceId: number
}
