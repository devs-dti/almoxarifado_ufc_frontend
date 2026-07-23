export type Supplier = {
  id: string
  corporateName: string
  cnpj?: string
  phone?: string
  deletedAt?: string | null
}

export type CreateSupplierPayload = {
  corporateName: string
  cnpj?: string
  phone?: string
}

export type UpdateSupplierPayload = Partial<CreateSupplierPayload>
