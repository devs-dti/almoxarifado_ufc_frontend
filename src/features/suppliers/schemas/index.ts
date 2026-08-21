import { z } from 'zod'

export const supplierSchema = z.object({
  corporateName: z.string().min(1, 'Razão Social é obrigatória'),
  cnpj: z.string().min(1, 'CNPJ é obrigatório')
    .transform(v => v.replace(/[^a-zA-Z0-9]/g, ''))
    .refine(v => v.length === 14, 'CNPJ deve ter exatamente 14 caracteres'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  address: z.object({
    street: z.string().min(1, 'Logradouro é obrigatório'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().min(1, 'Complemento é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(1, 'UF é obrigatório'),
    cep: z.string().min(1, 'CEP é obrigatório').transform(v => v.replace(/\D/g, '')),
  })
})

export type SupplierFormData = z.infer<typeof supplierSchema>
