'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companySchema, type CompanyFormData } from '../schemas'
import { useCreateCompany, useUpdateCompany } from '../api/useCompanies'
import type { Company } from '../types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CompanyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company?: Company | null
}

export function CompanyFormDialog({
  open,
  onOpenChange,
  company,
}: CompanyFormDialogProps) {
  const isEditing = !!company

  const createMutation = useCreateCompany()
  const updateMutation = useUpdateCompany()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      sei: '',
      name: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (company) {
        reset({
          sei: company.sei,
          name: company.name,
        })
      } else {
        reset({
          sei: '',
          name: '',
        })
      }
    }
  }, [open, company, reset])

  const onSubmit = (data: CompanyFormData) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: company.id, data },
        {
          onSuccess: () => {
            onOpenChange(false)
          },
        }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onOpenChange(false)
        },
      })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Empresa' : 'Nova Empresa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sei">Código SEI</Label>
            <Input
              id="sei"
              placeholder="Ex: SEI-001"
              {...register('sei')}
            />
            {errors.sei && (
              <p className="text-sm text-red-500">{errors.sei.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa</Label>
            <Input
              id="name"
              placeholder="Ex: Tech Corp"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mr-2"
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
