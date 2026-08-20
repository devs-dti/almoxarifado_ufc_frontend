import { z } from 'zod'

export const transferItemSchema = z.object({
  materialId: z.string().min(1, 'Selecione um material'),
  requestedQuantity: z.coerce.number().positive('Quantidade deve ser positiva'),
})

export const createTransferSchema = z.object({
  exitType: z.enum([
    'SECTOR',
    'CLAIM',
    'DONATION',
    'EXPIRATION',
    'OTHERS',
    'INVENTORY_ADJUSTMENT'
  ], { required_error: 'Selecione o tipo de saída' }),
  notes: z.string().min(1, 'Observações são obrigatórias'),
  items: z.array(transferItemSchema).min(1, 'Adicione ao menos um item'),
}).superRefine((data, ctx) => {
  const ids = data.items.map(item => item.materialId)
  const uniqueIds = new Set(ids)
  if (uniqueIds.size !== ids.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Você não pode adicionar o mesmo material mais de uma vez na mesma saída.',
      path: ['items'],
    })
  }
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
