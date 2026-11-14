'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowDownToLine, ArrowRightLeft, FileBarChart, LockKeyhole, Package, Pencil, ShieldCheck, UserRound, Users } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { formatLongDate } from '@/shared/lib/format'
import { Button } from '@/components/ui/button'
import { EditProfileDialog } from './EditProfileDialog'
import { ChangePasswordDialog } from './ChangePasswordDialog'

const ROLE_INFO = {
  ADMIN: { label: 'Administrador', description: 'Gerencie os materiais, as movimentações e os usuários do sistema.' },
  MANAGER: { label: 'Gerente', description: 'Acompanhe o estoque, as movimentações, os relatórios e as auditorias.' },
  STAFF: { label: 'Colaborador', description: 'Consulte materiais e acompanhe suas transferências.' },
}

export function ProfileView() {
  const { data: user, isLoading, isError, refetch } = useProfile()
  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [failedImage, setFailedImage] = useState<string | null>(null)

  if (isLoading) {
    return <div className="max-w-4xl animate-pulse space-y-5 p-1 md:p-2"><div className="h-8 w-40 rounded bg-slate-200" /><div className="h-36 rounded-xl bg-slate-200" /><div className="h-64 rounded-xl bg-slate-200" /></div>
  }

  if (isError || !user) {
    return <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-6"><h2 className="font-semibold text-slate-900">Não foi possível carregar o perfil</h2><p className="mt-2 text-sm text-slate-600">Ocorreu uma falha ao obter os dados da conta.</p><Button onClick={() => refetch()} variant="outline" className="mt-5">Tentar novamente</Button></div>
  }

  const role = ROLE_INFO[user.role]
  const initials = user.name?.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'U'
  const isManager = user.role === 'ADMIN' || user.role === 'MANAGER'
  const access = [
    { label: 'Materiais', icon: Package, detail: isManager ? 'Consulta e gerenciamento' : 'Consulta de materiais' },
    { label: 'Transferências', icon: ArrowRightLeft, detail: isManager ? 'Consulta e aprovação' : 'Solicitação e acompanhamento' },
    { label: 'Entradas', icon: ArrowDownToLine, detail: isManager ? 'Consulta e gerenciamento' : 'Acesso restrito na interface' },
    { label: 'Relatórios', icon: FileBarChart, detail: isManager ? 'Consulta e exportação' : 'Acesso restrito' },
    { label: 'Gestão de usuários', icon: Users, detail: user.role === 'ADMIN' ? 'Gerenciamento de usuários' : 'Acesso restrito na interface' },
  ]

  return (
    <div className="max-w-4xl space-y-6 p-1 md:p-2">
      <header>
        <nav aria-label="Navegação estrutural" className="mb-2 flex items-center gap-2 text-xs text-slate-500"><Link href="/dashboard" className="hover:text-violet-700">Início</Link><span aria-hidden="true">/</span><span className="text-slate-700" aria-current="page">Meu perfil</span></nav>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Meu perfil</h1>
        <p className="mt-1 text-sm text-slate-600">Informações e configurações da sua conta.</p>
      </header>

      <section aria-label="Resumo do perfil" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-xl font-semibold text-slate-600">
              {user.imageUrl && failedImage !== user.imageUrl ? <img src={user.imageUrl} alt={`Foto de ${user.name}`} className="h-full w-full object-cover" onError={() => setFailedImage(user.imageUrl ?? null)} /> : <span aria-label={`Iniciais de ${user.name}`}>{initials}</span>}
            </div>
            <div className="min-w-0">
              <h2 className="break-words text-xl font-semibold text-slate-900">{user.name}</h2>
              <p className="mt-1 break-words text-sm text-slate-600">{user.jobTitle || 'Cargo não informado'}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                <span className="font-medium text-violet-700">{role?.label || 'Perfil não informado'}</span>
                {user.enabled !== undefined && <><span aria-hidden="true" className="text-slate-300">•</span><span>{user.enabled ? 'Conta ativa' : 'Conta inativa'}</span></>}
              </div>
            </div>
          </div>
          <Button onClick={() => setEditOpen(true)} variant="outline" className="w-full gap-2 sm:w-auto"><Pencil size={15} aria-hidden="true" />Editar perfil</Button>
        </div>
      </section>

      <section aria-labelledby="personal-details" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 id="personal-details" className="flex items-center gap-2.5 text-base font-semibold text-slate-900"><UserRound size={18} className="shrink-0 text-slate-500" aria-hidden="true" />Dados pessoais</h2>
        <dl className="mt-5 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
          <div className="min-w-0"><dt className="text-xs text-slate-500">E-mail</dt><dd className="mt-1 break-all text-sm font-medium text-slate-800">{user.email || 'Não informado'}</dd></div>
          {user.createdAt && <div><dt className="text-xs text-slate-500">Cadastrado em</dt><dd className="mt-1 text-sm font-medium text-slate-800">{formatLongDate(user.createdAt)}</dd></div>}
        </dl>
      </section>

      <section aria-labelledby="security-title" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 id="security-title" className="flex items-center gap-2.5 text-base font-semibold text-slate-900"><LockKeyhole size={18} className="shrink-0 text-slate-500" aria-hidden="true" />Segurança</h2><p className="mt-1 text-sm text-slate-600 sm:pl-7">Atualize a senha usada para acessar sua conta.</p></div>
          <Button variant="outline" onClick={() => setPasswordOpen(true)} className="w-full sm:w-auto">Alterar senha</Button>
        </div>
      </section>

      <section aria-labelledby="access-title" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 id="access-title" className="flex items-center gap-2.5 text-base font-semibold text-slate-900"><ShieldCheck size={18} className="shrink-0 text-slate-500" aria-hidden="true" />Seu acesso</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600 sm:pl-7">{role?.description || 'Consulte um administrador para obter informações sobre seu perfil.'}</p>
        <dl className="mt-5 divide-y divide-slate-100 border-t border-slate-100">
          {access.map(({ label, icon: Icon, detail }) => <div key={label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5"><dt className="flex items-center gap-2.5 text-sm font-medium text-slate-800"><Icon size={16} className="shrink-0 text-slate-500" aria-hidden="true" />{label}</dt><dd className="pl-[26px] text-sm text-slate-600 sm:pl-0 sm:text-right">{detail}</dd></div>)}
        </dl>
      </section>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} user={user} />
      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />
    </div>
  )
}
