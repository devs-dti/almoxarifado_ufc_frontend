import type { EntityId } from '@/shared/types/id'

export type Address = {
  street?: string | null
  number?: string | null
  complement?: string | null
  city?: string | null
  state?: string | null
  cep?: string | null
}

export type Supplier = {
  id: EntityId
  corporateName: string
  cnpj?: string
  email?: string | null
  phone?: string | null
  address?: Address | null
  deletedAt?: string | null
}

export type CreateSupplierPayload = {
  corporateName: string
  cnpj: string
  email?: string
  phone?: string
  address?: Address
}

export type UpdateSupplierPayload = Partial<CreateSupplierPayload>
