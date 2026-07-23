import { z } from 'zod'

export const supplierSchema = z.object({
  corporateName: z.string().min(1, 'Razão Social é obrigatória'),
  cnpj: z.string().optional(),
  phone: z.string().optional(),
})

export type SupplierFormData = z.infer<typeof supplierSchema>
