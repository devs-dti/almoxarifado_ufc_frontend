import { z } from 'zod'

export const supplierSchema = z.object({
  corporateName: z.string().trim().min(1, 'Razão Social é obrigatória').max(255, 'Informe até 255 caracteres'),
  cnpj: z.string().min(1, 'CNPJ é obrigatório')
    .transform(v => v.replace(/[^a-zA-Z0-9]/g, ''))
    .refine(v => v.length === 14, 'CNPJ deve ter exatamente 14 caracteres'),
  email: z.string().trim().pipe(z.string().email('E-mail inválido').or(z.literal(''))).optional(),
  phone: z.string().trim().max(20, 'Informe até 20 caracteres').optional(),
  address: z.object({
    street: z.string().trim().max(255, 'Informe até 255 caracteres').optional(),
    number: z.string().trim().max(20, 'Informe até 20 caracteres').optional(),
    complement: z.string().trim().max(100, 'Informe até 100 caracteres').optional(),
    city: z.string().trim().max(100, 'Informe até 100 caracteres').optional(),
    state: z.string().trim().toUpperCase().refine(v => v === '' || /^[A-Z]{2}$/.test(v), 'UF deve ter 2 letras').optional(),
    cep: z.string().transform(v => v.replace(/\D/g, '')).refine(v => v === '' || v.length === 8, 'CEP deve ter 8 dígitos').optional(),
  }).optional(),
})

export type SupplierFormData = z.infer<typeof supplierSchema>
