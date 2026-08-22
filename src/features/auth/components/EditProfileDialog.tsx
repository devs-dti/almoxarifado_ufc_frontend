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
import { usersApi } from '@/features/users/api'
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
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (open) {
      setName(user.name ?? '')
      setJobTitle(user.jobTitle ?? '')
      setEmail(user.email ?? '')
    }
  }, [open, user])

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
      const updated = await usersApi.update(user.id, {
        name: name.trim(),
        jobTitle: jobTitle.trim() || undefined,
        email: email.trim(),
        role: user.role,
      })

      const updatedUser: User = {
        ...user,
        name: updated.name ?? name.trim(),
        jobTitle: updated.jobTitle ?? jobTitle.trim(),
        email: updated.email ?? email.trim(),
      }

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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
