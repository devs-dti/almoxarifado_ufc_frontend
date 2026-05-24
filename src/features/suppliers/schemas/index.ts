import { z } from 'zod'

export const supplierSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
})

export type SupplierFormData = z.infer<typeof supplierSchema>
