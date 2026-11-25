'use client'

import { useEffect, useRef, useState } from 'react'
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
import { AsyncSearchSelect, type SearchSelectOption, type SearchSelectParams } from '@/components/ui/async-search-select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMaterialDetails, useSaveMaterial } from '../hooks'
import { materialGroupsApi } from '@/features/material-groups/api'
import { unitsApi } from '@/features/sectors/api'
import { materialSchema, type MaterialFormData } from '../schemas'
import type { Material } from '../types'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing?: Material | null
}

async function loadGroups(params: SearchSelectParams) {
  const page = await materialGroupsApi.list(params)
  return { ...page, content: page.content.map((group) => ({ id: group.id, label: group.name })) }
}

async function loadUnits(params: SearchSelectParams) {
  const page = await unitsApi.listPage(params)
  return { ...page, content: page.content.map((unit) => ({ id: unit.id, label: `${unit.name} (${unit.abbreviation})` })) }
}

export function MaterialFormDialog({ open, onOpenChange, editing }: Props) {
  const { saveMaterial, isPending } = useSaveMaterial()
  const { data: details, isPending: isLoadingDetails, isError: detailsError, refetch: refetchDetails } = useMaterialDetails(open && editing ? editing.id : undefined)
  const [selectedGroup, setSelectedGroup] = useState<SearchSelectOption | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<SearchSelectOption | null>(null)
  const initializedFor = useRef<string | null>(null)
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
    if (!open) {
      initializedFor.current = null
      return
    }
    if (editing && !details) return
    const key = editing?.id ?? 'new'
    // Buscar opções ou atualizar o cache não deve apagar o que já foi digitado.
    if (initializedFor.current === key) return
    initializedFor.current = key
    if (editing && details) {
      form.reset({
        name: editing.name,
        internalCode: editing.internalCode,
        description: editing.description ?? '',
        minQuantity: editing.minQuantity ?? 1,
        materialGroupId: details.materialGroup?.id ?? '',
        measurementUnitId: details.measurementUnit.id,
      })
      setSelectedGroup(details.materialGroup ? { id: details.materialGroup.id, label: details.materialGroup.name } : null)
      setSelectedUnit({ id: details.measurementUnit.id, label: details.measurementUnit.name })
    } else {
      form.reset({ name: '', internalCode: '', description: '', minQuantity: 1, materialGroupId: '', measurementUnitId: '' })
      setSelectedGroup(null)
      setSelectedUnit(null)
    }
  }, [editing, open, details, form])

  async function onSubmit(data: MaterialFormData) {
    const success = await saveMaterial(data, editing, details)
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

        {editing && isLoadingDetails ? <p role="status" className="py-6 text-sm text-slate-500">Carregando dados do material...</p>
          : editing && detailsError ? <div role="alert" className="space-y-3 py-6"><p className="text-sm text-red-700">Não foi possível carregar os dados para edição.</p><Button type="button" variant="outline" onClick={() => refetchDetails()}>Tentar novamente</Button></div>
          : <Form {...form}>
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
                  <FormLabel>Grupo (opcional)</FormLabel>
                  <FormControl>
                    <AsyncSearchSelect
                      ref={field.ref}
                      name={field.name}
                      onBlur={field.onBlur}
                      value={selectedGroup}
                      onValueChange={(option) => { field.onChange(option.id); setSelectedGroup(option.id ? option : null) }}
                      queryKey="material-groups"
                      loadOptions={loadGroups}
                      placeholder="Sem grupo"
                      searchPlaceholder="Buscar grupo pelo nome..."
                      emptyOption={{ id: '', label: 'Sem grupo', disabled: !!editing && !!details?.materialGroup }}
                    />
                  </FormControl>
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
                  <FormControl>
                    <AsyncSearchSelect
                      ref={field.ref}
                      name={field.name}
                      onBlur={field.onBlur}
                      value={selectedUnit}
                      onValueChange={(option) => { field.onChange(option.id); setSelectedUnit(option) }}
                      queryKey="measurement-units"
                      loadOptions={loadUnits}
                      placeholder="Selecione uma unidade"
                      searchPlaceholder="Buscar unidade pelo nome ou sigla..."
                    />
                  </FormControl>
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
        </Form>}
      </DialogContent>
    </Dialog>
  )
}
