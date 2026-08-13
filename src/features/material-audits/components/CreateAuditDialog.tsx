'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Search } from 'lucide-react'

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
import { Input } from '@/components/ui/input'

import { useCreateMaterialAudit } from '../hooks'
import { useMaterials } from '@/features/materials/hooks'
import { useUsers } from '@/features/users/hooks'

export function CreateAuditDialog() {
  const [open, setOpen] = useState(false)
  const [selectedMaterials, setSelectedMaterials] = useState<number[]>([])
  const [selectedAuditors, setSelectedAuditors] = useState<number[]>([])
  const [searchMaterial, setSearchMaterial] = useState('')

  const { data: materialsData, isLoading: loadingMaterials } = useMaterials({ size: 1000 })
  const { data: usersData, isLoading: loadingUsers } = useUsers({ size: 1000 })
  
  const createAudit = useCreateMaterialAudit()

  const materials = materialsData?.data || []
  const users = usersData?.data || []

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchMaterial.toLowerCase())
  )

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
          setSearchMaterial('')
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
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-4 sm:p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle>Criar Nova Auditoria</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Selecione os materiais a serem auditados e os auditores responsáveis.
          </DialogDescription>
        </DialogHeader>

        <form id="create-audit-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-4 sm:space-y-6 mt-2">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <h4 className="font-semibold text-sm">Selecione os Materiais</h4>
              <div className="relative w-full sm:w-48 shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <Input
                  placeholder="Buscar material..."
                  value={searchMaterial}
                  onChange={(e) => setSearchMaterial(e.target.value)}
                  className="h-8 pl-8 text-xs w-full"
                />
              </div>
            </div>
            
            {loadingMaterials ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-xl p-2 sm:p-3 max-h-32 sm:max-h-48 overflow-y-auto">
                {filteredMaterials.length === 0 ? (
                  <p className="text-xs text-gray-500 col-span-full text-center py-4">Nenhum material encontrado.</p>
                ) : (
                  filteredMaterials.map((m) => (
                    <label key={m.id} className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <Checkbox
                        checked={selectedMaterials.includes(m.id)}
                        onCheckedChange={() => toggleMaterial(m.id)}
                      />
                      <span className="truncate">{m.name}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-sm">Selecione os Auditores <span className="text-red-500">*</span></h4>
            {loadingUsers ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-xl p-2 sm:p-3 max-h-32 sm:max-h-48 overflow-y-auto">
                {users.map((u) => (
                  <label key={u.id} className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
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

        <DialogFooter className="mt-4 flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" type="button" onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button type="submit" form="create-audit-form" disabled={createAudit.isPending} className="bg-brand hover:bg-brand/90 w-full sm:w-auto">
            {createAudit.isPending ? 'Criando...' : 'Criar Auditoria'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
