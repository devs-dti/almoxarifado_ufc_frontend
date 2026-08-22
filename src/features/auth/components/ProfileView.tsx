'use client'

import React, { useState } from 'react'
import {
  User as UserIcon,
  ShieldCheck,
  Shield,
  CheckCircle2,
  XCircle,
  Briefcase,
  Mail,
  Calendar,
  Package,
  FileBarChart,
  Users,
  Pencil,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useProfile } from '../hooks/useProfile'
import { formatLongDate } from '@/shared/lib/format'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EditProfileDialog } from './EditProfileDialog'

const ROLE_INFO = {
  ADMIN: {
    label: 'Administrador',
    description: 'Acesso total ao sistema, gerenciamento de usuários, auditorias, inventários e relatórios.',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: ShieldCheck,
  },
  MANAGER: {
    label: 'Gerente',
    description: 'Gerenciamento de estoque, aprovação de transferências, relatórios e gestão de materiais.',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Shield,
  },
  STAFF: {
    label: 'Colaborador',
    description: 'Consulta de estoque, solicitação de saídas de materiais e acompanhamento de requisições.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: Shield,
  },
}

export function ProfileView() {
  const { data: user, isLoading, isError, refetch } = useProfile()
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-1 md:p-2 max-w-4xl">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="h-40 bg-gray-200 rounded-2xl w-full" />
        <div className="h-64 bg-gray-200 rounded-2xl w-full" />
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 rounded-2xl shadow-xs text-center max-w-lg mx-auto mt-8">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h3 className="text-base font-semibold text-gray-900">Não foi possível carregar o perfil</h3>
        <p className="text-xs text-gray-500 mt-1">
          Ocorreu uma falha ao obter os dados da conta.
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-5">
          Tentar novamente
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
    <div className="space-y-6 p-1 md:p-2 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-1">
          <Link href="/dashboard" className="hover:text-brand transition-colors">
            Início
          </Link>
          <span>/</span>
          <span className="text-gray-600">Meu Perfil</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Meu Perfil</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Informações cadastrais e nível de acesso no Almoxarifado UFC.
        </p>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-brand/20 to-purple-100 text-brand flex items-center justify-center border border-brand/10 shrink-0">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-bold tracking-tight">{userInitials}</span>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{user.name}</h2>
              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5">
                <Briefcase size={14} className="text-gray-400" />
                <span>{user.jobTitle || 'Cargo não informado'}</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleConfig.badgeClass}`}
                >
                  <RoleIcon size={12} />
                  {roleConfig.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    isEnabled
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {isEnabled ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {isEnabled ? 'Conta Ativa' : 'Conta Inativa'}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setEditOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2 text-xs self-start sm:self-center"
          >
            <Pencil size={13} />
            Editar Perfil
          </Button>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="space-y-6">
        {/* Card: Informações Cadastrais */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
              <UserIcon size={17} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Informações Cadastrais</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100/80">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Nome Completo
              </span>
              <span className="text-sm font-semibold text-gray-800 block truncate">{user.name}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100/80">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Cargo / Função
              </span>
              <span className="text-sm font-semibold text-gray-800 block truncate">
                {user.jobTitle || 'Não informado'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100/80 sm:col-span-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                E-mail Institucional
              </span>
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Mail size={15} className="text-gray-400" />
                {user.email || 'Não informado'}
              </span>
            </div>
          </div>

          {user.createdAt && (
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
              <Calendar size={14} className="text-gray-400" />
              <span>
                Cadastrado em: <strong>{formatLongDate(user.createdAt)}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Card: Permissões de Acesso */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <div className="pb-4 mb-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Permissões de Acesso ao Sistema</h3>
            <p className="text-xs text-gray-500 mt-0.5">{roleConfig.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={15} className="text-brand" />
                <span className="text-xs font-medium text-gray-800">Materiais & Estoque</span>
              </div>
              <Badge variant="success" className="text-[10px]">Liberado</Badge>
            </div>

            <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileBarChart size={15} className="text-blue-600" />
                <span className="text-xs font-medium text-gray-800">Entradas & Saídas</span>
              </div>
              <Badge variant="success" className="text-[10px]">Liberado</Badge>
            </div>

            <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileBarChart size={15} className="text-purple-600" />
                <span className="text-xs font-medium text-gray-800">Relatórios</span>
              </div>
              <Badge
                variant={user.role === 'STAFF' ? 'secondary' : 'success'}
                className="text-[10px]"
              >
                {user.role === 'STAFF' ? 'Parcial' : 'Liberado'}
              </Badge>
            </div>

            <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-emerald-600" />
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

      {/* Edit Profile Modal */}
      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} user={user} />
    </div>
  )
}
