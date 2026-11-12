import { z } from 'zod'

const fileSchema = z.custom<File>((v) => v instanceof File, {
  message: 'Imagem é obrigatória',
})

export const createUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  cpf: z.string().min(11, 'CPF deve ter 11 caracteres').max(11, 'Apenas números'),
  jobTitle: z.string().min(1, 'Cargo é obrigatório'),
  sectorId: z.string().uuid('Setor inválido'),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']),
  file: fileSchema.optional(),
})

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  email: z.string().email('E-mail inválido').optional(),
  password: z.string().min(8, 'Mínimo 8 caracteres').optional().or(z.literal('')),
  cpf: z.string().min(11, 'CPF deve ter 11 caracteres').max(11, 'Apenas números').optional(),
  jobTitle: z.string().min(1, 'Cargo é obrigatório').optional(),
  sectorId: z.string().uuid('Setor inválido').optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']).optional(),
  enabled: z.boolean().optional(),
  file: fileSchema.optional(),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>

export const userFormDialogSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').optional().or(z.literal('')),
  cpf: z.string().min(11, 'CPF deve ter 11 caracteres').max(11, 'Apenas números'),
  jobTitle: z.string().min(1, 'Cargo é obrigatório'),
  sectorId: z.string().uuid('Setor inválido'),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']),
  enabled: z.boolean().optional(),
  file: fileSchema.optional(),
})

export type UserFormDialogData = z.infer<typeof userFormDialogSchema>
