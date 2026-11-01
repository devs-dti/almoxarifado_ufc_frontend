'use client'

import { Package, Pencil, RefreshCw } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useMaterialDetails } from '../hooks'
import type { Material } from '../types'

export function MaterialDetailsDialog({ material, onClose, onEdit }: { material: Material | null; onClose: () => void; onEdit?: (material: Material) => void }) {
  const { data, isLoading, isError, refetch } = useMaterialDetails(material?.id)
  return (
    <Dialog open={!!material} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:max-w-xl sm:p-7">
        <DialogHeader className="pr-8 text-left">
          <DialogTitle className="text-xl text-slate-900">Detalhes do material</DialogTitle>
          <DialogDescription>Informações cadastradas no almoxarifado.</DialogDescription>
        </DialogHeader>
        {isLoading && <p role="status" className="py-10 text-center text-sm text-slate-500">Carregando detalhes...</p>}
        {isError && <div role="alert" className="py-8 text-center"><p className="text-sm text-red-700">Não foi possível carregar os detalhes.</p><Button type="button" variant="outline" className="mt-4" onClick={() => refetch()}><RefreshCw size={16} /> Tentar novamente</Button></div>}
        {data && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center">
              <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-violet-600 ring-1 ring-slate-200">
                {data.imageUrl ? <img src={data.imageUrl} alt={data.name} className="h-full w-full object-cover" /> : <Package size={32} aria-hidden="true" />}
              </div>
              <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-violet-700">{data.internalCode}</p><h2 className="mt-1 break-words text-xl font-semibold text-slate-900">{data.name}</h2></div>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Grupo</dt><dd className="mt-1 break-words text-sm font-medium text-slate-900">{data.materialGroup?.name || 'Não informado'}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Unidade de medida</dt><dd className="mt-1 text-sm font-medium text-slate-900">{data.measurementUnit?.name || 'Não informada'}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Quantidade mínima</dt><dd className="mt-1 text-sm font-medium text-slate-900">{data.minQuantity}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Última atualização</dt><dd className="mt-1 text-sm font-medium text-slate-900">{data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('pt-BR') : 'Não informada'}</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Descrição</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{data.description || 'Nenhuma descrição cadastrada.'}</dd></div>
            </dl>
            {onEdit && material && <div className="flex justify-end border-t border-slate-100 pt-4"><Button onClick={() => onEdit(material)} className="bg-brand text-white hover:bg-brand-hover"><Pencil size={16} /> Editar material</Button></div>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
