import type { EntityId } from '@/shared/types/id'

export type Address = {
  street: string
  number: string
  complement?: string
  city: string
  state: string
  cep: string
}

export type Supplier = {
  id: EntityId
  corporateName: string
  cnpj?: string
  email?: string
  phone?: string
  address?: Address
  deletedAt?: string | null
}

export type CreateSupplierPayload = {
  corporateName: string
  cnpj?: string
  email?: string
  phone?: string
  address?: Address
}

export type UpdateSupplierPayload = Partial<CreateSupplierPayload>
