export type Supplier = {
  id: number
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
