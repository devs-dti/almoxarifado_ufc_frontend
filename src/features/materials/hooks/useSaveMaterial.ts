import { toast } from 'sonner'
import { useCreateMaterial, useUpdateMaterial } from './index'
import type { Material, MaterialDetails, CreateMaterialPayload, UpdateMaterialPayload } from '../types'
import type { MaterialFormData } from '../schemas'

export function useSaveMaterial() {
  const create = useCreateMaterial()
  const update = useUpdateMaterial()

  async function saveMaterial(data: MaterialFormData, editing?: Material | null, details?: MaterialDetails): Promise<boolean> {
    try {
      if (editing) {
        if (!details) return false
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

        const currentGroupId = details.materialGroup?.id
        if (data.materialGroupId && currentGroupId !== data.materialGroupId) {
          patchPayload.materialGroupId = data.materialGroupId
        }

        const currentUnitId = details.measurementUnit.id
        if (data.measurementUnitId && currentUnitId !== data.measurementUnitId) {
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
        materialGroupId: data.materialGroupId || undefined,
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
