import type { EntityId } from '@/shared/types/id'

export type MaterialGroup = {
  id: EntityId
  name: string
  deletedAt?: string | null
}

export type CreateMaterialGroupPayload = {
  name: string
}

export type UpdateMaterialGroupPayload = {
  name?: string
}
