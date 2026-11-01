'use client'

import { useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2, UsersRound } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { hasAnyRole } from '@/shared/lib/rbac'
import { useAuthStore } from '@/store/useAuthStore'
import { useUsers, useDeleteUser } from '../hooks'
import { UserFormDialog } from './UserFormDialog'
import { UserDetailsDialog } from './UserDetailsDialog'
import { UserAvatar } from './UserAvatar'
import type { UserListItem } from '../types'

const ROLE_LABELS: Record<string, string> = { ADMIN: 'Administrador', MANAGER: 'Gerente', STAFF: 'Colaborador' }
const ROLE_COLORS: Record<string, string> = { ADMIN: 'text-violet-700 bg-violet-50 border-violet-200', MANAGER: 'text-blue-700 bg-blue-50 border-blue-200', STAFF: 'text-slate-600 bg-slate-50 border-slate-200' }

export function UserList() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [sort, setSort] = useState('name,asc')
  const [search, setSearch] = useState('')
  const [term] = useDebounceValue(search.trim(), 300)
  const [filterRole, setFilterRole] = useState<'' | 'ADMIN' | 'MANAGER' | 'STAFF'>('')
  const [enabled, setEnabled] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<UserListItem | null>(null)
  const [deleting, setDeleting] = useState<UserListItem | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const role = useAuthStore((s) => s.user?.role)
  const canManage = hasAnyRole(role, ['ADMIN'])
  const { data, isLoading, isError, refetch } = useUsers({ page, size, sort, search: term || undefined, role: filterRole || undefined, enabled: enabled === '' ? undefined : enabled === 'true' })
  const users = data?.content ?? []
  const remove = useDeleteUser()
  async function handleDelete() {
    if (!deleting) return
    try { await remove.mutateAsync(deleting.id); if (users.length === 1 && page > 0) setPage((p) => p - 1); toast.success('Usuário removido.'); setDeleting(null) } catch { /* O cliente HTTP exibe o erro. */ }
  }
  return <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-2xl font-bold tracking-tight text-slate-900">Usuários</h2><p className="mt-1 text-sm text-slate-500">Consulte e gerencie os usuários do sistema.</p></div>{canManage && <Button size="sm" className="rounded-xl px-4" onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus size={15} /> Novo usuário</Button>}</div>
    <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100/70 text-violet-700"><UsersRound size={16} aria-hidden="true" /></span><div><p className="text-sm font-semibold text-slate-800">Todos os usuários</p>{data && !isError && <p className="text-xs text-slate-500">{data.totalElements} {data.totalElements === 1 ? 'registro' : 'registros'}</p>}</div></div><div className="flex flex-wrap gap-2">
      <label className="relative flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs text-slate-500 focus-within:ring-2 focus-within:ring-violet-200 sm:flex-none"><span aria-hidden="true">Ordenar por</span><span aria-hidden="true" className="text-sm font-medium text-slate-800">{sort === 'name,asc' ? 'Nome (A–Z)' : 'Nome (Z–A)'}</span><select aria-label="Ordenar usuários por" value={sort} onChange={(e) => { setSort(e.target.value); setPage(0) }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0"><option value="name,asc">Nome (A–Z)</option><option value="name,desc">Nome (Z–A)</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" aria-hidden="true" /></label>
      <label className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs text-slate-500 focus-within:ring-2 focus-within:ring-violet-200"><span aria-hidden="true" className="text-sm font-medium text-slate-800">{size}</span><span aria-hidden="true">por página</span><select aria-label="Usuários por página" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0) }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0"><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" aria-hidden="true" /></label>
    </div></div>
    <div className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"><label className="space-y-1 text-xs font-medium text-slate-600 sm:col-span-2">Nome<div className="relative"><Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" /><Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} placeholder="Buscar por nome" className="h-10 rounded-xl bg-white pl-9 text-sm" /></div></label><label className="space-y-1 text-xs font-medium text-slate-600">Perfil<select value={filterRole} onChange={(e) => { setFilterRole(e.target.value as typeof filterRole); setPage(0) }} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800"><option value="">Todos</option><option value="ADMIN">Administrador</option><option value="MANAGER">Gerente</option><option value="STAFF">Colaborador</option></select></label><label className="space-y-1 text-xs font-medium text-slate-600">Status<select value={enabled} onChange={(e) => { setEnabled(e.target.value); setPage(0) }} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800"><option value="">Todos</option><option value="true">Ativo</option><option value="false">Inativo</option></select></label></div>
    {isLoading && <div role="status" className="space-y-3"><span className="sr-only">Carregando usuários...</span>{[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />)}</div>}
    {isError && <div role="alert" className="py-8 text-center text-sm text-destructive">Erro ao carregar usuários. <button type="button" onClick={() => refetch()} className="font-semibold underline">Tentar novamente</button></div>}
    {!isLoading && !isError && users.length === 0 && <p className="py-12 text-center text-sm text-slate-500">Nenhum usuário encontrado.</p>}
    {!isLoading && !isError && users.map((user) => <div key={user.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-violet-200 sm:gap-4">
      <button type="button" onClick={() => setDetailId(user.id)} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-violet-600" aria-label={`Ver detalhes de ${user.name}`}><UserAvatar src={user.imageUrl} name={user.name} /><span className="min-w-0"><span className="flex flex-wrap items-center gap-2"><span className="break-words text-sm font-semibold text-slate-900">{user.name}</span><span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role] ?? ''}`}>{ROLE_LABELS[user.role] ?? user.role}</span>{user.enabled !== undefined && <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${user.enabled ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>{user.enabled ? 'Ativo' : 'Inativo'}</span>}</span><span className="mt-1 block break-all text-xs text-slate-500">{user.email}{user.jobTitle ? ` · ${user.jobTitle}` : ''}</span></span></button>
      {canManage && <div className="flex shrink-0 items-center gap-1"><button type="button" onClick={() => { setEditing(user); setDialogOpen(true) }} aria-label={`Editar usuário ${user.name}`} className="rounded-xl p-2 text-slate-400 hover:bg-violet-50 hover:text-violet-700"><Pencil size={16} /></button><button type="button" onClick={() => setDeleting(user)} aria-label={`Remover usuário ${user.name}`} className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-700"><Trash2 size={16} /></button></div>}
    </div>)}
    {!isLoading && !isError && data && data.totalElements > 0 && <nav aria-label="Paginação de usuários" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"><p className="text-sm text-slate-600">Mostrando {page * size + 1}–{Math.min((page + 1) * size, data.totalElements)} de {data.totalElements} {data.totalElements === 1 ? 'usuário' : 'usuários'}</p><div className="flex items-center gap-2"><button type="button" aria-label="Página anterior" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40"><ChevronLeft size={17} /></button><span aria-live="polite" className="px-2 text-sm text-slate-600">Página {page + 1} de {data.totalPages}</span><button type="button" aria-label="Próxima página" disabled={page + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40"><ChevronRight size={17} /></button></div></nav>}
    {canManage && <UserFormDialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null) }} editing={editing} />}
    <UserDetailsDialog userId={detailId} onClose={() => setDetailId(null)} />
    <AlertDialog open={canManage && !!deleting} onOpenChange={(open) => { if (!open) setDeleting(null) }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remover usuário</AlertDialogTitle><AlertDialogDescription>O usuário {deleting?.name} será removido da listagem. Confirme para continuar.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={remove.isPending}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={(e) => { e.preventDefault(); handleDelete() }} disabled={remove.isPending} className="bg-destructive text-white hover:bg-destructive/90">{remove.isPending ? 'Removendo...' : 'Remover'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>
}
