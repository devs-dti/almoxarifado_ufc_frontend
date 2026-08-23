import { toast } from 'sonner'
import { useCreateMaterial, useUpdateMaterial, useMeasurementUnits } from './index'
import { useMaterialGroups } from '@/features/material-groups/hooks'
import type { Material, CreateMaterialPayload, UpdateMaterialPayload } from '../types'
import type { MaterialFormData } from '../schemas'

export function useSaveMaterial() {
  const create = useCreateMaterial()
  const update = useUpdateMaterial()
  const { data: groupsResponse } = useMaterialGroups({ page: 0, size: 100 })
  const groups = groupsResponse?.content
  const { data: units } = useMeasurementUnits()

  async function saveMaterial(data: MaterialFormData, editing?: Material | null): Promise<boolean> {
    try {
      if (editing) {
        const patchPayload: Partial<UpdateMaterialPayload> = {}

        if (data.name.trim() !== editing.name) {
          patchPayload.name = data.name.trim()
        }
        if (data.internalCode.trim() !== editing.internalCode) {
          patchPayload.internalCode = data.internalCode.trim()
        }
        const desc = data.description?.trim() || undefined
        const currentDesc = editing.description || undefined
        if (desc !== currentDesc) {
          patchPayload.description = desc
        }
        const minQty = Math.max(1, Math.floor(Number(data.minQuantity) || 1))
        if (minQty !== editing.minQuantity) {
          patchPayload.minQuantity = minQty
        }

        const matchedGroup = groups?.find((g) => g.name === editing.materialGroupName)
        if (data.materialGroupId && String(matchedGroup?.id) !== String(data.materialGroupId)) {
          patchPayload.materialGroupId = data.materialGroupId
        }

        const matchedUnit = units?.find((u) => u.name === editing.measurementUnitName)
        if (data.measurementUnitId && String(matchedUnit?.id) !== String(data.measurementUnitId)) {
          patchPayload.measurementUnitId = data.measurementUnitId
        }

        if (data.file instanceof File) {
          patchPayload.file = data.file
        }

        if (Object.keys(patchPayload).length === 0) {
          toast.info('Nenhuma alteração realizada.')
          return true
        }

        await update.mutateAsync({ id: editing.id, data: patchPayload as UpdateMaterialPayload })
        toast.success('Material atualizado!')
        return true
      }

      const payload: CreateMaterialPayload = {
        name: data.name.trim(),
        internalCode: data.internalCode.trim(),
        description: data.description?.trim() || undefined,
        minQuantity: Math.max(1, Math.floor(Number(data.minQuantity) || 1)),
        materialGroupId: data.materialGroupId,
        measurementUnitId: data.measurementUnitId,
        file: data.file instanceof File ? data.file : undefined,
      }

      await create.mutateAsync(payload)
      toast.success('Material cadastrado!')
      return true
    } catch {
      // O interceptor do axios em client.ts já dispara o toast de erro formatado
      return false
    }
  }

  return {
    saveMaterial,
    isPending: create.isPending || update.isPending,
  }
}
