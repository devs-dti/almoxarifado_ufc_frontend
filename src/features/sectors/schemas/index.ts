import { z } from 'zod'

export const sectorSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  code: z.string().min(1, 'Código é obrigatório'),
})

export const unitSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  abbreviation: z.string().min(1, 'Abreviação é obrigatória').max(10, 'Máximo 10 caracteres'),
})

export type SectorFormData = z.infer<typeof sectorSchema>
export type UnitFormData = z.infer<typeof unitSchema>
