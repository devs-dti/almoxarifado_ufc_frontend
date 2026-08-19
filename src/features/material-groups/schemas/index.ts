import { z } from 'zod'

export const materialGroupSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
})

export type MaterialGroupFormData = z.infer<typeof materialGroupSchema>
