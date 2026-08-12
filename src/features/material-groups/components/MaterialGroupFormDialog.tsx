'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { materialGroupSchema, type MaterialGroupFormData } from '../schemas'
import { useCreateMaterialGroup, useUpdateMaterialGroup } from '../hooks'
import type { MaterialGroup } from '../types'

type MaterialGroupFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupToEdit?: MaterialGroup | null
}

export function MaterialGroupFormDialog({
  open,
  onOpenChange,
  groupToEdit,
}: MaterialGroupFormDialogProps) {
  const isEditing = !!groupToEdit

  const createMutation = useCreateMaterialGroup()
  const updateMutation = useUpdateMaterialGroup()

  const form = useForm<MaterialGroupFormData>({
    resolver: zodResolver(materialGroupSchema),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (groupToEdit) {
        form.reset({
          name: groupToEdit.name,
        })
      } else {
        form.reset({ name: '' })
      }
    }
  }, [open, groupToEdit, form])

  const onSubmit = async (data: MaterialGroupFormData) => {
    try {
      if (isEditing && groupToEdit) {
        await updateMutation.mutateAsync({ id: groupToEdit.id, payload: data })
        toast.success('Grupo de materiais atualizado com sucesso!')
      } else {
        await createMutation.mutateAsync(data)
        toast.success('Grupo de materiais criado com sucesso!')
      }
      onOpenChange(false)
    } catch (error) {
      toast.error('Ocorreu um erro ao salvar o grupo de materiais.')
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Grupo de Materiais' : 'Novo Grupo de Materiais'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Grupo</FormLabel>
                  <FormControl>
                    <Input className="rounded-xl" placeholder="Ex: Papelaria" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl bg-brand hover:bg-brand/90" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
