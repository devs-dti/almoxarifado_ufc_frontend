'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { useCreateMaterialAudit } from '../hooks'
import { useMaterials } from '@/features/materials/hooks'
import { useUsers } from '@/features/users/hooks'

export function CreateAuditDialog() {
  const [open, setOpen] = useState(false)
  const [selectedMaterials, setSelectedMaterials] = useState<number[]>([])
  const [selectedAuditors, setSelectedAuditors] = useState<number[]>([])

  const { data: materialsData, isLoading: loadingMaterials } = useMaterials({ size: 1000 })
  const { data: usersData, isLoading: loadingUsers } = useUsers({ size: 1000 })
  
  const createAudit = useCreateMaterialAudit()

  const materials = materialsData?.data || []
  const users = usersData?.data || []

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (selectedMaterials.length === 0) {
      toast.error('Selecione pelo menos um material.')
      return
    }

    if (selectedAuditors.length === 0) {
      toast.error('Selecione pelo menos um auditor.')
      return
    }

    createAudit.mutate(
      {
        materialIds: selectedMaterials.map(String),
        auditorIds: selectedAuditors.map(String),
      },
      {
        onSuccess: () => {
          toast.success('Auditoria criada com sucesso!')
          setOpen(false)
          setSelectedMaterials([])
          setSelectedAuditors([])
        },
        onError: () => {
          toast.error('Erro ao criar auditoria.')
        },
      }
    )
  }

  function toggleMaterial(id: number) {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    )
  }

  function toggleAuditor(id: number) {
    setSelectedAuditors((prev) =>
      prev.includes(id) ? prev.filter((uId) => uId !== id) : [...prev, id]
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5 rounded-xl px-3 bg-brand hover:bg-brand/90" size="sm">
          <Plus size={15} />
          Nova Auditoria
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Criar Nova Auditoria</DialogTitle>
          <DialogDescription>
            Selecione os materiais a serem auditados e os auditores responsáveis.
          </DialogDescription>
        </DialogHeader>

        <form id="create-audit-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Selecione os Materiais</h4>
            {loadingMaterials ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-xl p-3 max-h-48 overflow-y-auto">
                {materials.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <Checkbox
                      checked={selectedMaterials.includes(m.id)}
                      onCheckedChange={() => toggleMaterial(m.id)}
                    />
                    <span className="truncate">{m.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Selecione os Auditores <span className="text-red-500">*</span></h4>
            {loadingUsers ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-xl p-3 max-h-48 overflow-y-auto">
                {users.map((u) => (
                  <label key={u.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <Checkbox
                      checked={selectedAuditors.includes(u.id)}
                      onCheckedChange={() => toggleAuditor(u.id)}
                    />
                    <span className="truncate">{u.name} ({u.role})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="mt-4">
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="create-audit-form" disabled={createAudit.isPending} className="bg-brand hover:bg-brand/90">
            {createAudit.isPending ? 'Criando...' : 'Criar Auditoria'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
