'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounceValue } from 'usehooks-ts'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { materialsApi } from '@/features/materials/api'
import type { Material } from '@/features/materials/types'

export function MaterialSearch({ onChange, index }: { onChange: (id: string) => void; index: number }) {
  const [selected, setSelected] = useState<Material | null>(null)
  const [search, setSearch] = useState('')
  const [mode, setMode] = useState<'name' | 'code'>('name')
  const [page, setPage] = useState(0)
  const [term] = useDebounceValue(search.trim(), 300)
  const { data, isFetching, isError, refetch } = useQuery({ queryKey: ['transfer-material-search', mode, term, page], queryFn: () => materialsApi.list({ page, size: 8, sort: 'name,asc', ...(mode === 'name' ? { search: term } : { internalCode: term }) }), enabled: !selected && term.length >= 2 })
  if (selected) return <div className="flex items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50/60 p-3"><div className="min-w-0"><p className="break-words text-sm font-medium text-slate-900">{selected.name}</p><p className="text-xs text-slate-500">{selected.internalCode}</p></div><button type="button" aria-label={`Alterar material ${index + 1}`} onClick={() => { setSelected(null); setSearch(''); setPage(0); onChange('') }} className="rounded-lg p-2 text-slate-500 hover:bg-white"><X size={16} /></button></div>
  return <div className="space-y-2"><div className="flex flex-col gap-2 sm:flex-row"><label className="sr-only" htmlFor={`transfer-mode-${index}`}>Buscar material por</label><select id={`transfer-mode-${index}`} value={mode} onChange={(e) => { setMode(e.target.value as 'name' | 'code'); setPage(0) }} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="name">Nome ou descrição</option><option value="code">Código interno</option></select><div className="relative min-w-0 flex-1"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" /><Input aria-label={`Buscar material ${index + 1}`} value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} placeholder={mode === 'name' ? 'Digite o nome ou descrição' : 'Digite o código'} className="h-10 rounded-xl bg-white pl-9" /></div></div>
    {search.trim().length < 2 ? <p className="text-xs text-slate-500">Digite pelo menos 2 caracteres para buscar.</p> : search.trim() !== term || isFetching ? <p role="status" className="text-xs text-slate-500">Buscando materiais...</p> : isError ? <p role="alert" className="text-xs text-red-700">Não foi possível buscar materiais. <button type="button" onClick={() => refetch()} className="underline">Tentar novamente</button></p> : data && <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">{data.content.length === 0 ? <p className="p-3 text-sm text-slate-500">Nenhum material encontrado.</p> : <ul aria-label={`Resultados de material ${index + 1}`} className="divide-y divide-slate-100">{data.content.map((material) => <li key={material.id}><button type="button" onClick={() => { setSelected(material); onChange(material.id) }} className="w-full px-3 py-2 text-left hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-violet-600"><span className="block text-sm font-medium">{material.name}</span><span className="text-xs text-slate-500">{material.internalCode} · {material.measurementUnitName}</span></button></li>)}</ul>}{data.totalPages > 1 && <div className="flex items-center justify-between border-t border-slate-100 p-2 text-xs"><button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="p-1 disabled:opacity-40">Anterior</button><span>Página {page + 1} de {data.totalPages}</span><button type="button" disabled={page + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="p-1 disabled:opacity-40">Próxima</button></div>}</div>}
  </div>
}
