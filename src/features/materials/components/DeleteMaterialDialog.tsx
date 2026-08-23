'use client'

import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteMaterial } from '../hooks'
import type { Material } from '../types'

type Props = {
  material: Material | null
  onOpenChange: (v: boolean) => void
}

export function DeleteMaterialDialog({ material, onOpenChange }: Props) {
  const deleteMaterial = useDeleteMaterial()

  async function handleConfirm() {
    if (!material) return
    try {
      await deleteMaterial.mutateAsync(material.id)
      toast.success(`"${material.name}" removido.`)
      onOpenChange(false)
    } catch {
      // O interceptor do axios em client.ts já exibe o toast com a mensagem exata do backend
    }
  }

  return (
    <AlertDialog open={!!material} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover material?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{material?.name}</strong> será desativado. Estoque e histórico são preservados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive hover:bg-destructive/90"
            disabled={deleteMaterial.isPending}
          >
            {deleteMaterial.isPending ? 'Removendo...' : 'Remover'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
