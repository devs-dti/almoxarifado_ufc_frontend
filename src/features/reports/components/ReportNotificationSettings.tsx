'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounceValue } from 'usehooks-ts'
import { ArrowLeft, Check, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/useAuthStore'
import { reportNotificationsApi } from '../api/notifications'
import type { ReportNotificationSettings as Settings, ReportRecipient } from '../types/notifications'

const queryKey = ['reports', 'notification-settings'] as const
const roleLabels: Record<string, string> = { ADMIN: 'Administrador', MANAGER: 'Gerente' }
const descriptions = {
  EXPIRATION: {
    title: 'Vencimentos de materiais',
    description: 'Envia os lotes que constam no relatório até um mês à frente, com PDF e Excel anexados.',
  },
  LOW_STOCK: {
    title: 'Estoque baixo ou zerado',
    description: 'Envia os materiais que precisam de reposição, com PDF e Excel anexados. Lotes vencidos não entram no saldo.',
  },
}

function RecipientSearch({ reportType, selected, disabled, onSelect }: {
  reportType: Settings['type']
  selected: ReportRecipient[]
  disabled: boolean
  onSelect: (recipient: ReportRecipient) => void
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [term] = useDebounceValue(search.trim(), 300)
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ['reports', 'notification-recipients', term, page],
    queryFn: () => reportNotificationsApi.searchRecipients(term, page),
    enabled: term.length >= 2,
  })
  const waiting = search.trim() !== term || isFetching

  return <div className="space-y-2">
    <label htmlFor={`recipient-search-${reportType}`} className="text-sm font-medium text-slate-800">Adicionar responsável</label>
    <div className="relative">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <Input id={`recipient-search-${reportType}`} value={search} maxLength={100} disabled={disabled} onChange={(event) => { setSearch(event.target.value); setPage(0) }} placeholder="Buscar por nome ou e-mail" className="h-11 rounded-xl bg-white pl-9" />
    </div>
    <p className="text-xs leading-5 text-slate-500">Administradores e gerentes ativos. Digite pelo menos 2 caracteres para buscar.</p>
    {search.trim().length >= 2 && <div aria-live="polite" className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {waiting ? <p role="status" className="p-3 text-sm text-slate-500">Buscando responsáveis...</p>
        : isError ? <p role="alert" className="p-3 text-sm text-red-700">Não foi possível carregar a busca. <button type="button" onClick={() => refetch()} className="underline">Tentar novamente</button></p>
          : data && <>
            {data.content.length === 0 ? <p className="p-3 text-sm text-slate-500">Nenhum responsável encontrado.</p> : <ul aria-label="Responsáveis encontrados" className="divide-y divide-slate-100">
              {data.content.map((recipient) => {
                const added = selected.some((item) => item.id === recipient.id)
                return <li key={recipient.id}><button type="button" disabled={disabled || added || selected.length >= 100} onClick={() => { onSelect(recipient); setSearch(''); setPage(0) }} className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-violet-600 disabled:opacity-60">
                  <span className="min-w-0"><span className="block break-words text-sm font-medium text-slate-900">{recipient.name}</span><span className="mt-0.5 block break-all text-xs text-slate-500">{recipient.email} · {roleLabels[recipient.role ?? '']}</span></span>
                  {added ? <Check size={16} aria-label="Já adicionado" className="shrink-0 text-emerald-700" /> : <span className="shrink-0 text-xs font-medium text-violet-700">Adicionar</span>}
                </button></li>
              })}
            </ul>}
            {data.totalPages > 1 && <nav aria-label="Paginação de responsáveis" className="flex items-center justify-between border-t border-slate-100 p-2 text-xs text-slate-600">
              <button type="button" disabled={disabled || page === 0} onClick={() => setPage((value) => value - 1)} className="rounded-lg p-2 disabled:opacity-40">Anterior</button>
              <span>Página {page + 1} de {data.totalPages}</span>
              <button type="button" disabled={disabled || page + 1 >= data.totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg p-2 disabled:opacity-40">Próxima</button>
            </nav>}
          </>}
    </div>}
  </div>
}

function ReportSettingsCard({ initial }: { initial: Settings }) {
  const [saved, setSaved] = useState(initial)
  const [enabled, setEnabled] = useState(initial.enabled)
  const [recipients, setRecipients] = useState(initial.recipients)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => reportNotificationsApi.update(initial.type, { enabled, recipientIds: recipients.map((item) => item.id) }),
    onSuccess: (updated) => {
      setSaved(updated)
      setEnabled(updated.enabled)
      setRecipients(updated.recipients)
      queryClient.setQueryData<Settings[]>(queryKey, (current) => current?.map((item) => item.type === updated.type ? updated : item))
      toast.success('Configuração de envio salva.')
    },
  })
  const dirty = enabled !== saved.enabled || recipients.length !== saved.recipients.length
    || recipients.some((item) => !saved.recipients.some((previous) => previous.id === item.id))
  const hasUnavailable = recipients.some((recipient) => !recipient.eligible)
  const canSave = dirty && !mutation.isPending && (!enabled || (recipients.length > 0 && !hasUnavailable))
  const description = descriptions[initial.type]

  return <section aria-labelledby={`report-title-${initial.type}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="space-y-5 p-5 sm:p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div className="max-w-xl"><h2 id={`report-title-${initial.type}`} className="text-base font-semibold text-slate-900">{description.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{description.description}</p></div>
        <label className="flex shrink-0 cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700"><input type="checkbox" checked={enabled} disabled={mutation.isPending} onChange={(event) => setEnabled(event.target.checked)} className="h-4 w-4 accent-violet-600" />Envio ativado</label>
      </div>
      <div className="border-t border-slate-100 pt-5">
        <p className="mb-3 text-sm font-medium text-slate-800">Responsáveis <span className="font-normal text-slate-500">({recipients.length}/100)</span></p>
        {recipients.length === 0 ? <p className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">Nenhum responsável selecionado.</p> : <ul aria-label={`Responsáveis por ${description.title.toLowerCase()}`} className="divide-y divide-slate-100 rounded-xl border border-slate-200">
          {recipients.map((recipient) => <li key={recipient.id} className="flex items-center gap-3 px-3 py-3 sm:px-4">
            <div className="min-w-0 flex-1"><p className="break-words text-sm font-medium text-slate-900">{recipient.name}</p><p className="mt-0.5 break-all text-xs text-slate-500">{recipient.email ?? 'Conta removida'}{recipient.role ? ` · ${roleLabels[recipient.role] ?? 'Colaborador'}` : ''}</p>{!recipient.eligible && <p className="mt-1 text-xs text-amber-800">Indisponível para receber. Remova ou regularize o cadastro e recarregue esta tela.</p>}</div>
            <button type="button" aria-label={`Remover ${recipient.name} dos destinatários`} disabled={mutation.isPending} onClick={() => setRecipients((current) => current.filter((item) => item.id !== recipient.id))} className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-violet-600 disabled:opacity-40"><X size={16} aria-hidden="true" /></button>
          </li>)}
        </ul>}
      </div>
      <RecipientSearch reportType={initial.type} selected={recipients} disabled={mutation.isPending || recipients.length >= 100} onSelect={(recipient) => setRecipients((current) => current.some((item) => item.id === recipient.id) ? current : [...current, recipient])} />
      {enabled && (recipients.length === 0 || hasUnavailable) && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-900">{recipients.length === 0 ? 'Selecione ao menos um responsável para ativar o envio.' : 'Há responsáveis indisponíveis. Eles não recebem o relatório; remova-os antes de salvar o envio ativado.'}</p>}
      {mutation.isError && <p role="alert" className="text-sm text-red-700">Não foi possível salvar. Confira se os responsáveis continuam ativos e autorizados e tente novamente.</p>}
    </div>
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs leading-5 text-slate-500">{dirty ? 'Há alterações não salvas.' : 'O relatório só é enviado quando há materiais a relatar.'}</p>
      <Button type="button" disabled={!canSave} onClick={() => mutation.mutate()} className="rounded-xl">{mutation.isPending ? 'Salvando...' : 'Salvar configuração'}</Button>
    </div>
  </section>
}

export function ReportNotificationSettings() {
  const role = useAuthStore((state) => state.user?.role)
  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey,
    queryFn: reportNotificationsApi.list,
    enabled: role === 'ADMIN',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
    <Link href="/dashboard/relatorios" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-violet-700"><ArrowLeft size={16} aria-hidden="true" />Voltar para relatórios</Link>
    <header className="max-w-3xl"><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Notificações por e-mail</h1><p className="mt-2 text-sm leading-6 text-slate-600">Escolha quem recebe os relatórios automáticos do almoxarifado. Cada mensagem é enviada individualmente para o e-mail atual do responsável.</p></header>
    {!role ? <p role="status" className="py-8 text-sm text-slate-500">Carregando acesso...</p>
      : role !== 'ADMIN' ? <p role="alert" className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">Apenas administradores podem gerenciar os destinatários dos relatórios.</p>
        : isPending || isFetching ? <p role="status" className="py-8 text-sm text-slate-500">Carregando configurações...</p>
          : isError ? <p role="alert" className="py-8 text-sm text-red-700">Não foi possível carregar as configurações. <button type="button" onClick={() => refetch()} className="underline">Tentar novamente</button></p>
            : <div className="max-w-4xl space-y-6">{data?.map((settings) => <ReportSettingsCard key={settings.type} initial={settings} />)}<p className="text-xs leading-5 text-slate-500">Os horários de envio seguem o agendamento configurado no sistema. Desativar um envio mantém os responsáveis selecionados para uma próxima ativação.</p></div>}
  </div>
}
