import { z } from 'zod'

export const materialSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  internalCode: z.string().min(1, 'Código obrigatório'),
  description: z.string().optional(),
  minQuantity: z.coerce.number().int().min(0, 'Quantidade mínima deve ser ≥ 0'),
  materialGroupId: z.string().min(1, 'Selecione um grupo'),
  measurementUnitId: z.string().min(1, 'Selecione uma unidade'),
  file: z.any().optional(),
})

export type MaterialFormData = z.infer<typeof materialSchema>
