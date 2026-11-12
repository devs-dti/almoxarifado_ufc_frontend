'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { authApi } from '../api'
import { UserAvatar } from '@/features/users/components/UserAvatar'
import { useAuthStore } from '@/store/useAuthStore'
import { useQueryClient } from '@tanstack/react-query'
import { authKeys } from '../hooks/useProfile'
import type { User } from '../types'

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

export function EditProfileDialog({ open, onOpenChange, user }: EditProfileDialogProps) {
  const [name, setName] = useState(user.name ?? '')
  const [jobTitle, setJobTitle] = useState(user.jobTitle ?? '')
  const [email, setEmail] = useState(user.email ?? '')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (open) {
      setName(user.name ?? '')
      setJobTitle(user.jobTitle ?? '')
      setEmail(user.email ?? '')
      setFile(null)
    }
  }, [open, user])

  useEffect(() => {
    if (!open || !file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [open, file])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('O nome completo é obrigatório.')
      return
    }

    if (!email.trim()) {
      toast.error('O e-mail é obrigatório.')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('jobTitle', jobTitle.trim())
      formData.append('email', email.trim())
      if (file) formData.append('file', file)
      const updatedUser = await authApi.updateProfile(formData)

      setAuth(updatedUser)
      queryClient.setQueryData(authKeys.me(), updatedUser)
      await queryClient.invalidateQueries({ queryKey: authKeys.all })

      toast.success('Perfil atualizado com sucesso!')
      onOpenChange(false)
    } catch {
      toast.error('Não foi possível salvar as alterações. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
            <UserAvatar src={preview ?? user.imageUrl} name={name || 'Usuário'} large />
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-sm font-semibold text-slate-800">Foto do perfil</p>
              <p className="text-xs text-slate-500">JPEG, PNG ou WebP, até 5 MB.</p>
              <label className="inline-flex cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                Escolher foto
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => {
                  const selected = e.target.files?.[0]
                  if (!selected) return
                  if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size > 5 * 1024 * 1024) {
                    toast.error('Escolha uma imagem JPEG, PNG ou WebP de até 5 MB.')
                    e.target.value = ''
                    return
                  }
                  setFile(selected)
                  e.target.value = ''
                }} />
              </label>
              {file && <button type="button" className="ml-3 text-xs font-medium text-violet-700 hover:underline" onClick={() => setFile(null)}>Desfazer seleção</button>}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Nome Completo</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Cargo / Função</label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Ex: Almoxarife, Assistente em Administração"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">E-mail Institucional</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@ufc.br"
              required
            />
          </div>

          <DialogFooter className="gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
