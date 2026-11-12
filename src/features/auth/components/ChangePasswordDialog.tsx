'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/shared/components/PasswordInput'
import { authApi } from '../api'

export function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false)

  function changeOpen(next: boolean) {
    if (loading) return
    if (!next) { setCurrentPassword(''); setNewPassword(''); setConfirmation('') }
    onOpenChange(next)
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!currentPassword) { toast.error('Informe sua senha atual.'); return }
    if (newPassword.length < 8 || !newPassword.trim()) { toast.error('A nova senha deve ter pelo menos 8 caracteres.'); return }
    if (newPassword !== confirmation) { toast.error('As senhas não coincidem.'); return }
    setLoading(true)
    try {
      await authApi.changePassword({ currentPassword, newPassword })
      setCurrentPassword(''); setNewPassword(''); setConfirmation('')
      onOpenChange(false)
      toast.success('Senha alterada com sucesso.')
    } catch {
      // O cliente HTTP apresenta a mensagem retornada pelo servidor.
    } finally { setLoading(false) }
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl sm:max-w-md">
        <DialogHeader><DialogTitle>Alterar senha</DialogTitle><DialogDescription>Informe sua senha atual e escolha uma nova senha para sua conta.</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5"><label htmlFor="current-password" className="text-sm font-medium text-slate-700">Senha atual</label><PasswordInput id="current-password" autoComplete="current-password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></div>
          <div className="space-y-1.5"><label htmlFor="new-password" className="text-sm font-medium text-slate-700">Nova senha</label><PasswordInput id="new-password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /><p className="text-xs text-slate-500">Use pelo menos 8 caracteres.</p></div>
          <div className="space-y-1.5"><label htmlFor="confirm-new-password" className="text-sm font-medium text-slate-700">Confirme a nova senha</label><PasswordInput id="confirm-new-password" autoComplete="new-password" required value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /></div>
          <Link href="/forgot-password" className="inline-block text-xs font-medium text-violet-700 hover:underline">Esqueceu sua senha atual?</Link>
          <DialogFooter className="gap-2 pt-2"><Button type="button" variant="outline" onClick={() => changeOpen(false)} disabled={loading}>Cancelar</Button><Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar senha'}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
