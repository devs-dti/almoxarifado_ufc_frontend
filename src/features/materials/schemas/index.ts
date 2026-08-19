import { z } from 'zod'

export const materialSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  code: z.string().min(1, 'Código obrigatório'),
  minQuantity: z.coerce.number().int().min(0, 'Quantidade mínima deve ser ≥ 0'),
  groupId: z.string().min(1, 'Selecione um grupo'),
  unitId: z.string().min(1, 'Selecione uma unidade'),
})

export type MaterialFormData = z.infer<typeof materialSchema>
