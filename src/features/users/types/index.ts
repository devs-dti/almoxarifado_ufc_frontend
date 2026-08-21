import type { Role } from '@/features/auth/types'
import type { EntityId } from '@/shared/types/id'

export type { Role }

import type { Sector } from '@/features/sectors/types'
import type { Contract } from '@/features/contracts/types'

export type UserListItem = {
  id: EntityId
  name: string
  email: string
  role: Role
  jobTitle?: string
  imageUrl?: string | null
  enabled?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export type UserDetail = UserListItem & {
  cpf: string
  sector?: Sector | null
  contracts?: Contract[]
}

export type CreateUserPayload = {
  name: string
  email: string
  password: string
  role: Role
  cpf: string
  jobTitle: string
  sectorId: string
  file?: File
}

export type UpdateUserPayload = Partial<CreateUserPayload> & { enabled?: boolean }
