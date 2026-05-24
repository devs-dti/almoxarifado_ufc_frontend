import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email obrigatório'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  })
