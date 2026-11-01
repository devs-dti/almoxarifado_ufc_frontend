'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebounceValue } from 'usehooks-ts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetCompanies } from '@/features/companies/api/useCompanies'
import { useUsers } from '@/features/users/hooks'
import { contractSchema, type ContractFormData } from '../schemas'
import { useCreateContract, useUpdateContract, useRenewContract } from '../api/useContracts'
import type { ContractDetail } from '../types'

export type ContractFormMode = 'create' | 'edit' | 'renew'
export function ContractForm({ mode = 'create', initialData, onSuccess, onCancel }: { mode?: ContractFormMode; initialData?: ContractDetail; onSuccess?: () => void; onCancel?: () => void }) {
  const create = useCreateContract()
  const update = useUpdateContract()
  const renew = useRenewContract()
  const [companySearch, setCompanySearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [companyPage, setCompanyPage] = useState(0)
  const [userPage, setUserPage] = useState(0)
  const [companyTerm] = useDebounceValue(companySearch.trim(), 300)
  const [userTerm] = useDebounceValue(userSearch.trim(), 300)
  const companies = useGetCompanies({ page: companyPage, size: 10, search: companyTerm || undefined, sort: 'name,asc' })
  const users = useUsers({ page: userPage, size: 10, search: userTerm || undefined, sort: 'name,asc' })
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ContractFormData>({ resolver: zodResolver(contractSchema), defaultValues: { referenceNumber: mode === 'renew' ? '' : initialData?.referenceNumber ?? '', startDate: mode === 'renew' ? '' : initialData?.startDate?.slice(0, 10) ?? '', endDate: mode === 'renew' ? '' : initialData?.endDate?.slice(0, 10) ?? '', status: mode === 'renew' ? true : initialData?.status ?? true, companyId: initialData?.company?.id ?? '', userIds: initialData?.users?.map((u) => u.id) ?? [] } })
  const selectedCompany = watch('companyId')
  const selectedUsers = watch('userIds') ?? []
  const [companyNames, setCompanyNames] = useState<Record<string, string>>(initialData?.company ? { [initialData.company.id]: initialData.company.name } : {})
  const [userNames, setUserNames] = useState<Record<string, string>>(() => Object.fromEntries((initialData?.users ?? []).map((user) => [user.id, user.name])))
  const pending = create.isPending || update.isPending || renew.isPending
  function submit(data: ContractFormData) {
    const startDateTime = `${data.startDate}T00:00:00`
    const endDateTime = `${data.endDate}T00:00:00`
    if (mode === 'edit' && initialData) update.mutate({ id: initialData.id, data: { ...data, startDate: data.startDate, endDate: data.endDate } }, { onSuccess })
    else if (mode === 'renew' && initialData) renew.mutate({ id: initialData.id, data: { referenceNumber: data.referenceNumber, startDate: startDateTime, endDate: endDateTime } }, { onSuccess })
    else create.mutate({ ...data, startDate: startDateTime, endDate: endDateTime }, { onSuccess })
  }
  return <form onSubmit={handleSubmit(submit)} className="space-y-5">
    <div className="space-y-2"><Label htmlFor="referenceNumber">Número de referência</Label><Input id="referenceNumber" className="rounded-xl" placeholder="Ex.: CTR-001" {...register('referenceNumber')} />{errors.referenceNumber && <p className="text-sm text-red-700">{errors.referenceNumber.message}</p>}</div>
    <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="startDate">Data de início</Label><Input id="startDate" type="date" className="rounded-xl" {...register('startDate')} />{errors.startDate && <p className="text-sm text-red-700">{errors.startDate.message}</p>}</div><div className="space-y-2"><Label htmlFor="endDate">Data de término</Label><Input id="endDate" type="date" className="rounded-xl" {...register('endDate')} />{errors.endDate && <p className="text-sm text-red-700">{errors.endDate.message}</p>}</div></div>
    {mode !== 'renew' && <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" {...register('status')} className="h-4 w-4 accent-violet-700" /> Contrato ativo</label>}
    {mode === 'renew' ? <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Empresa e fiscais serão mantidos do contrato original.</div> : <>
      <section className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"><div><h3 className="text-sm font-semibold text-slate-900">Empresa vinculada</h3><p className="mt-1 text-xs text-slate-500">Busque e selecione a empresa.</p></div><Input aria-label="Buscar empresa" value={companySearch} onChange={(e) => { setCompanySearch(e.target.value); setCompanyPage(0) }} placeholder="Buscar por nome ou SEI" className="rounded-xl bg-white" />{selectedCompany && <p className="text-xs text-violet-700">Selecionada: {companyNames[selectedCompany] ?? 'Empresa vinculada'}</p>}{companies.isLoading ? <p className="text-xs text-slate-500">Carregando empresas...</p> : companies.isError ? <p role="alert" className="text-xs text-red-700">Não foi possível carregar empresas. <button type="button" onClick={() => companies.refetch()} className="underline">Tentar novamente</button></p> : <div className="space-y-2">{companies.data?.content.length ? companies.data.content.map((company) => <label key={company.id} className="flex items-center gap-2 rounded-lg bg-white p-2 text-sm"><input type="radio" name="company-choice" checked={selectedCompany === company.id} onChange={() => { setValue('companyId', company.id, { shouldValidate: true }); setCompanyNames((v) => ({ ...v, [company.id]: company.name })) }} />{company.name}</label>) : <p className="text-xs text-slate-500">Nenhuma empresa encontrada.</p>}<div className="flex items-center justify-between text-xs text-slate-600"><button type="button" disabled={companyPage === 0} onClick={() => setCompanyPage((p) => p - 1)} className="p-1 disabled:opacity-40">Anterior</button><span>Página {companyPage + 1} de {Math.max(1, companies.data?.totalPages ?? 0)}</span><button type="button" disabled={companyPage + 1 >= (companies.data?.totalPages ?? 0)} onClick={() => setCompanyPage((p) => p + 1)} className="p-1 disabled:opacity-40">Próxima</button></div></div>}{errors.companyId && <p className="text-xs text-red-700">{errors.companyId.message}</p>}</section>
      <section className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"><div><h3 className="text-sm font-semibold text-slate-900">Fiscais</h3><p className="mt-1 text-xs text-slate-500">Selecione os usuários vinculados ao contrato.</p></div><Input aria-label="Buscar fiscal" value={userSearch} onChange={(e) => { setUserSearch(e.target.value); setUserPage(0) }} placeholder="Buscar por nome" className="rounded-xl bg-white" />{selectedUsers.length > 0 && <div className="flex flex-wrap gap-2" aria-label="Fiscais selecionados">{selectedUsers.map((id) => <span key={id} className="inline-flex items-center gap-1 rounded-lg bg-violet-100 px-2 py-1 text-xs text-violet-800">{userNames[id] ?? id}<button type="button" aria-label={`Remover fiscal ${userNames[id] ?? id}`} onClick={() => setValue('userIds', selectedUsers.filter((selected) => selected !== id), { shouldValidate: true })} className="rounded px-1 hover:bg-violet-200">×</button></span>)}</div>}{users.isLoading ? <p className="text-xs text-slate-500">Carregando usuários...</p> : users.isError ? <p role="alert" className="text-xs text-red-700">Não foi possível carregar usuários. <button type="button" onClick={() => users.refetch()} className="underline">Tentar novamente</button></p> : <div className="space-y-2">{users.data?.content.length ? users.data.content.map((user) => <label key={user.id} className="flex items-center gap-2 rounded-lg bg-white p-2 text-sm"><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={(e) => { setValue('userIds', e.target.checked ? [...selectedUsers, user.id] : selectedUsers.filter((id) => id !== user.id), { shouldValidate: true }); setUserNames((v) => ({ ...v, [user.id]: user.name })) }} />{user.name}</label>) : <p className="text-xs text-slate-500">Nenhum usuário encontrado.</p>}<div className="flex items-center justify-between text-xs text-slate-600"><button type="button" disabled={userPage === 0} onClick={() => setUserPage((p) => p - 1)} className="p-1 disabled:opacity-40">Anterior</button><span>Página {userPage + 1} de {Math.max(1, users.data?.totalPages ?? 0)}</span><button type="button" disabled={userPage + 1 >= (users.data?.totalPages ?? 0)} onClick={() => setUserPage((p) => p + 1)} className="p-1 disabled:opacity-40">Próxima</button></div></div>}{errors.userIds && <p className="text-xs text-red-700">{errors.userIds.message}</p>}</section>
    </>}
    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={onCancel} disabled={pending}>Cancelar</Button><Button type="submit" disabled={pending}>{pending ? 'Salvando...' : mode === 'renew' ? 'Renovar contrato' : 'Salvar contrato'}</Button></div>
  </form>
}
