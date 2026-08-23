import { z } from 'zod'

export const materialSchema = z.object({
  name: z.string().trim().min(2, 'Nome do material deve ter pelo menos 2 caracteres'),
  internalCode: z.string().trim().min(1, 'Código interno obrigatório'),
  description: z.string().trim().optional(),
  minQuantity: z.coerce
    .number()
    .int('A quantidade deve ser um número inteiro')
    .min(1, 'Quantidade mínima deve ser maior que 0'),
  materialGroupId: z.string().min(1, 'Selecione um grupo de materiais'),
  measurementUnitId: z.string().min(1, 'Selecione uma unidade de medida'),
  file: z.any().optional(),
})

export type MaterialFormData = z.infer<typeof materialSchema>
