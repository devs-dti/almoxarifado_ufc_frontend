'use client'

import React, { useState } from 'react'
import {
  User as UserIcon,
  ShieldCheck,
  Shield,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Calendar,
  Clock,
  Briefcase,
  Mail,
  Fingerprint,
  RefreshCw,
  Sparkles,
  Lock,
  Layers,
  FileBarChart,
  Package,
  Users,
  LogOut,
  AlertCircle,
  KeyRound,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useProfile } from '../hooks/useProfile'
import { useAuthStore } from '@/store/useAuthStore'
import { formatDateTime, formatLongDate } from '@/shared/lib/format'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const ROLE_INFO = {
  ADMIN: {
    label: 'Administrador',
    description: 'Acesso total ao sistema, gerenciamento de usuários, auditorias, inventários e relatórios.',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    icon: ShieldCheck,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
  },
  MANAGER: {
    label: 'Gerente',
    description: 'Gerenciamento de estoque, aprovação de transferências, relatórios e gestão de materiais.',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    icon: Shield,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
  },
  STAFF: {
    label: 'Colaborador',
    description: 'Consulta de estoque, solicitação de saídas de materiais e acompanhamento de requisições.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    icon: Shield,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
}

export function ProfileView() {
  const { data: user, isLoading, isError, refetch, isRefetching } = useProfile()
  const logout = useAuthStore((s) => s.logout)
  const [copiedId, setCopiedId] = useState(false)

  const handleCopyId = () => {
    if (!user?.id) return
    navigator.clipboard.writeText(String(user.id))
    setCopiedId(true)
    toast.success('ID do usuário copiado com sucesso!')
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handleRefresh = async () => {
    try {
      await refetch()
      toast.success('Dados do perfil atualizados!')
    } catch {
      toast.error('Erro ao atualizar dados.')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-1 md:p-2">
        {/* Header skeleton */}
        <div className="h-10 w-48 bg-gray-200 rounded-lg" />
        {/* Hero skeleton */}
        <div className="h-64 bg-gray-200 rounded-2xl w-full" />
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="h-48 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Não foi possível carregar o perfil</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          Ocorreu uma falha ao obter os dados do seu usuário. Tente novamente mais tarde.
        </p>
        <Button onClick={handleRefresh} variant="outline" className="mt-6 gap-2">
          <RefreshCw size={16} /> Tentar novamente
        </Button>
      </div>
    )
  }

  const roleConfig = ROLE_INFO[user.role] ?? ROLE_INFO.STAFF
  const RoleIcon = roleConfig.icon
  const isEnabled = user.enabled !== false
  const userInitials = user.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join('')
    : 'U'

  return (
    <div className="space-y-6 p-1 md:p-2 animate-in fade-in duration-300">
      {/* Top action / title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-brand transition-colors">Início</Link>
            <span>/</span>
            <span className="text-gray-600">Meu Perfil</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Meu Perfil</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Visualize seus dados cadastrais, nível de acesso e detalhes da conta no Sistema Soma UFC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefetching}
            className="gap-2 text-gray-600 hover:text-brand bg-white border-gray-200 shadow-sm"
          >
            <RefreshCw size={14} className={isRefetching ? 'animate-spin text-brand' : ''} />
            {isRefetching ? 'Atualizando...' : 'Atualizar Dados'}
          </Button>
        </div>
      </div>

      {/* Hero Profile Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100/80 shadow-sm">
        {/* Banner gradient background */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-brand via-purple-700 to-indigo-800 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white/90 text-xs font-medium border border-white/10">
            <Sparkles size={13} className="text-amber-300" />
            <span>Almoxarifado UFC Sobral</span>
          </div>
        </div>

        {/* Profile details container */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            {/* Avatar with status ring */}
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white p-1.5 shadow-xl border border-gray-100">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-tr from-brand/20 to-purple-100 text-brand flex items-center justify-center border border-brand/10">
                      <span className="text-3xl sm:text-4xl font-bold tracking-tight">{userInitials}</span>
                    </div>
                  )}
                </div>
                {/* Active/Inactive badge indicator */}
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                    isEnabled ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                  title={isEnabled ? 'Usuário Ativo' : 'Usuário Inativo'}
                >
                  {isEnabled ? (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="space-y-1 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{user.name}</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <Briefcase size={15} className="text-gray-400 shrink-0" />
                  <span>{user.jobTitle || 'Cargo não especificado'}</span>
                </div>
              </div>
            </div>

            {/* Badges on right side */}
            <div className="flex flex-wrap items-center gap-2 sm:mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-xs ${roleConfig.badgeClass}`}
              >
                <RoleIcon size={14} />
                {roleConfig.label}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-xs ${
                  isEnabled
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {isEnabled ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {isEnabled ? 'Conta Ativa' : 'Conta Inativa'}
              </span>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100/80">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Identificador (UUID)
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-medium text-gray-700 truncate" title={String(user.id)}>
                  {String(user.id)}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-gray-400 hover:text-brand transition-colors p-1 rounded hover:bg-gray-200/50 shrink-0"
                  title="Copiar UUID"
                >
                  {copiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100/80">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Tipo de Acesso
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                <RoleIcon size={15} className={roleConfig.color} />
                {roleConfig.label}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100/80">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Data de Criação
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Calendar size={14} className="text-gray-400" />
                {user.createdAt ? formatDateTime(user.createdAt) : 'Não registrado'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100/80">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Última Atualização
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Clock size={14} className="text-gray-400" />
                {user.updatedAt ? formatDateTime(user.updatedAt) : 'Não registrado'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Info & Swagger Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Informações Cadastrais Completas */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                  <UserIcon size={18} />
                </div>
                <h3 className="text-base font-bold text-gray-900">Informações Cadastrais</h3>
              </div>
              <span className="text-xs font-medium text-gray-400">Sincronizado com API</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-gray-50/50 border border-gray-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <UserIcon size={17} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Nome Completo
                  </span>
                  <span className="text-sm font-semibold text-gray-800 truncate">{user.name}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50/50 border border-gray-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Briefcase size={17} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Cargo / Função
                  </span>
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {user.jobTitle || 'Não especificado'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50/50 border border-gray-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail size={17} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    E-mail Institucional
                  </span>
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {user.email || 'Não informado'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50/50 border border-gray-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Fingerprint size={17} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Identificador (ID)
                  </span>
                  <span className="text-xs font-mono font-medium text-gray-700 truncate" title={String(user.id)}>
                    {String(user.id)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps breakdown */}
            <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <Calendar size={15} className="text-gray-400" />
                <span>
                  <strong>Cadastrado em:</strong> {formatLongDate(user.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <Clock size={15} className="text-gray-400" />
                <span>
                  <strong>Última atualização:</strong> {formatDateTime(user.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Módulos & Permissões */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Permissões de Acesso ao Sistema</h3>
                  <p className="text-xs text-gray-500">{roleConfig.description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Package size={16} className="text-brand" />
                  <span className="text-xs font-medium text-gray-800">Materiais & Estoque</span>
                </div>
                <Badge variant="success" className="text-[10px]">Liberado</Badge>
              </div>

              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileBarChart size={16} className="text-blue-600" />
                  <span className="text-xs font-medium text-gray-800">Entradas & Saídas</span>
                </div>
                <Badge variant="success" className="text-[10px]">Liberado</Badge>
              </div>

              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileBarChart size={16} className="text-purple-600" />
                  <span className="text-xs font-medium text-gray-800">Relatórios Gerenciais</span>
                </div>
                <Badge
                  variant={user.role === 'STAFF' ? 'secondary' : 'success'}
                  className="text-[10px]"
                >
                  {user.role === 'STAFF' ? 'Parcial' : 'Liberado'}
                </Badge>
              </div>

              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Users size={16} className="text-emerald-600" />
                  <span className="text-xs font-medium text-gray-800">Gestão de Usuários</span>
                </div>
                <Badge
                  variant={user.role === 'ADMIN' ? 'success' : 'outline'}
                  className="text-[10px]"
                >
                  {user.role === 'ADMIN' ? 'Liberado' : 'Restrito'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Security & Session */}
        <div className="space-y-6">
          {/* Card: Segurança da Conta */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Segurança da Conta</h3>
                <span className="text-xs text-gray-400">Autenticação e Sessão</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-gray-50/60 border border-gray-100/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">Status da Sessão</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ativa
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Conectado com credenciais autenticadas via token seguro HttpOnly.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/forgot-password"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2.5 text-xs text-gray-700 hover:text-brand border-gray-200"
                  >
                    <KeyRound size={15} className="text-gray-400" />
                    Solicitar Redefinição de Senha
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => logout()}
                  className="w-full justify-start gap-2.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 transition-colors"
                >
                  <LogOut size={15} className="text-red-500" />
                  Encerrar Sessão no Dispositivo
                </Button>
              </div>
            </div>
          </div>

          {/* Card: Suporte e Ajuda */}
          <div className="bg-gradient-to-br from-brand/5 to-purple-50 rounded-2xl border border-brand/10 p-6">
            <h4 className="text-sm font-bold text-gray-900 mb-1">Precisa de suporte?</h4>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Caso seus dados cadastrais estejam incorretos ou você precise alterar seu nível de permissão, entre em contato com o administrador do sistema.
            </p>
            <Link href="/dashboard/faq">
              <Button size="sm" variant="outline" className="w-full gap-2 text-xs bg-white text-brand border-brand/20 hover:bg-brand/5">
                Central de Ajuda <ExternalLink size={13} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
