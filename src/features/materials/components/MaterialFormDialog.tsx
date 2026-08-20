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
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMeasurementUnits, useCreateMaterial, useUpdateMaterial } from '../hooks'
import { useMaterialGroups } from '@/features/material-groups/hooks'
import { materialSchema, type MaterialFormData } from '../schemas'
import type { Material } from '../types'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing?: Material | null
}

export function MaterialFormDialog({ open, onOpenChange, editing }: Props) {
  const { data: groupsResponse } = useMaterialGroups({ page: 0, size: 100 })
  const groups = groupsResponse?.content
  const { data: units } = useMeasurementUnits()
  const create = useCreateMaterial()
  const update = useUpdateMaterial()

  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: { name: '', internalCode: '', description: '', minQuantity: 0, materialGroupId: '', measurementUnitId: '' },
  })

  useEffect(() => {
    if (editing) {
      const matchedGroup = groups?.find(g => g.name === editing.materialGroupName)
      const matchedUnit = units?.find(u => u.name === editing.measurementUnitName)
      form.reset({
        name: editing.name,
        internalCode: editing.internalCode,
        description: editing.description ?? '',
        minQuantity: editing.minQuantity,
        materialGroupId: matchedGroup ? String(matchedGroup.id) : '',
        measurementUnitId: matchedUnit ? String(matchedUnit.id) : '',
      })
    } else {
      form.reset({ name: '', internalCode: '', description: '', minQuantity: 0, materialGroupId: '', measurementUnitId: '' })
    }
  }, [editing, open, form, groups, units])

  async function onSubmit(data: MaterialFormData) {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data })
        toast.success('Material atualizado!')
      } else {
        await create.mutateAsync(data)
        toast.success('Material cadastrado!')
      }
      onOpenChange(false)
    } catch {
      toast.error('Erro ao salvar material.')
    }
  }

  const isPending = create.isPending || update.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar material' : 'Novo material'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Papel A4" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código Interno</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: PAP-001" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Detalhes do material..." className="resize-none" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade mínima</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} placeholder="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="materialGroupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um grupo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups?.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="measurementUnitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade de medida</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma unidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units?.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} ({u.abbreviation})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField control={form.control} name="file" render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="col-span-2">
                <FormLabel>Foto do Material (Opcional)</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2 font-medium">
                      <Upload size={16} className="text-brand" />
                      Escolher arquivo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) onChange(file)
                        }}
                        {...field}
                      />
                    </label>
                    <span className="text-sm text-gray-500 truncate max-w-[250px]" title={value instanceof File ? value.name : ''}>
                      {value instanceof File ? value.name : 'Nenhum arquivo escolhido'}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : editing ? 'Salvar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
