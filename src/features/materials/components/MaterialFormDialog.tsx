'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMeasurementUnits, useSaveMaterial } from '../hooks'
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
  const { saveMaterial, isPending } = useSaveMaterial()
  const [preview, setPreview] = useState<string | null>(null)

  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: { name: '', internalCode: '', description: '', minQuantity: 1, materialGroupId: '', measurementUnitId: '' },
  })

  const selectedFile = form.watch('file') as File | undefined
  useEffect(() => {
    if (!(selectedFile instanceof File)) { setPreview(null); return }
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedFile])

  useEffect(() => {
    if (open) {
      if (editing) {
        const matchedGroup = groups?.find(g => g.name === editing.materialGroupName)
        const matchedUnit = units?.find(u => u.name === editing.measurementUnitName)
        form.reset({
          name: editing.name,
          internalCode: editing.internalCode,
          description: editing.description ?? '',
          minQuantity: editing.minQuantity ?? 1,
          materialGroupId: matchedGroup ? String(matchedGroup.id) : '',
          measurementUnitId: matchedUnit ? String(matchedUnit.id) : '',
        })
      } else {
        form.reset({ name: '', internalCode: '', description: '', minQuantity: 1, materialGroupId: '', measurementUnitId: '' })
      }
    }
  }, [editing, open, groups, units, form])

  async function onSubmit(data: MaterialFormData) {
    const success = await saveMaterial(data, editing)
    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:max-w-2xl sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900">{editing ? 'Editar material' : 'Novo material'}</DialogTitle>
          <DialogDescription>{editing ? 'Atualize as informações do material.' : 'Preencha as informações para cadastrar um material.'}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField control={form.control} name="file" render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Foto do material <span className="font-normal text-slate-500">(opcional)</span></FormLabel>
                <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center">
                  <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-violet-600 ring-1 ring-slate-200">
                    {preview || editing?.imageUrl ? <img src={preview || editing?.imageUrl || ''} alt="Prévia da foto do material" className="h-full w-full object-cover" /> : <ImagePlus size={28} aria-hidden="true" />}
                  </div>
                  <div className="min-w-0 space-y-2">
                    <p className="text-sm font-medium text-slate-800">{editing?.imageUrl || preview ? 'Foto do material' : 'Adicione uma foto'}</p>
                    <p className="text-xs leading-5 text-slate-500">Uma imagem ajuda a identificar o material mais rapidamente.</p>
                    <FormControl><input {...field} type="file" accept="image/*" className="block w-full text-xs text-slate-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-violet-100 file:px-3 file:py-2 file:font-semibold file:text-violet-800 hover:file:bg-violet-200" onChange={(e) => onChange(e.target.files?.[0])} /></FormControl>
                    {value instanceof File && <p className="break-all text-xs text-slate-500">{value.name}</p>}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )} />

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
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      placeholder="1"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value)
                        field.onChange(val)
                      }}
                    />
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
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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



            <DialogFooter className="border-t border-slate-100 pt-4">
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
