import { z } from 'zod'

export const createEntrySchema = z.object({
  type: z.enum(['SUPPLIER', 'DONATION', 'RETURN']),
  supplierId: z.string().optional(),
})

export const addItemSchema = z.object({
  materialId: z.string({ required_error: 'Selecione um material' }).min(1, 'Selecione um material'),
  quantity: z.coerce.number({ required_error: 'Informe a quantidade' }).positive('Quantidade deve ser positiva'),
  unitPrice: z.coerce.number({ required_error: 'Informe o preço unitário' }).nonnegative('Preço não pode ser negativo'),
  expiresAt: z.string().optional(),
})

export const attachInvoiceSchema = z.object({
  number: z.string().min(1, 'Número da nota é obrigatório'),
  issueDate: z.string().min(1, 'Data de emissão é obrigatória'),
  value: z.coerce.number({ required_error: 'Informe o valor' }).positive('Valor deve ser positivo'),
})

export type CreateEntryValues = z.infer<typeof createEntrySchema>
export type AddItemValues = z.infer<typeof addItemSchema>
export type AttachInvoiceValues = z.infer<typeof attachInvoiceSchema>
