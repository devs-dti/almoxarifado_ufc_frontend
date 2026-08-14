import { z } from 'zod'

export const transferItemSchema = z.object({
  materialId: z.string().min(1, 'Selecione um material'),
  requestedQuantity: z.coerce.number().positive('Quantidade deve ser positiva'),
})

export const createTransferSchema = z.object({
  sectorId: z.string().min(1, 'Selecione um setor'),
  items: z.array(transferItemSchema).min(1, 'Adicione ao menos um item'),
})

export const approveItemSchema = z.object({
  transferItemId: z.string(),
  approvedQuantity: z.coerce.number().nonnegative('Quantidade não pode ser negativa'),
})

export const approveTransferSchema = z.object({
  items: z.array(approveItemSchema),
})

export type CreateTransferValues = z.infer<typeof createTransferSchema>
export type ApproveTransferValues = z.infer<typeof approveTransferSchema>
