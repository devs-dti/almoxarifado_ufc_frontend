import type { EntityId } from '@/shared/types/id'

export type Supplier = {
  id: EntityId
  name: string
  cnpj?: string
  email?: string
  phone?: string
  deletedAt?: string | null
}

export type CreateSupplierPayload = {
  name: string
  cnpj?: string
  email?: string
  phone?: string
}

export type UpdateSupplierPayload = Partial<CreateSupplierPayload>
