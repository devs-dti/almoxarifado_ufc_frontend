import type { Metadata } from 'next'
import { ProfileView } from '@/features/auth/components/ProfileView'

export const metadata: Metadata = {
  title: 'Meu Perfil — Almoxarifado UFC',
  description: 'Visualização e gerenciamento do perfil do usuário no Sistema Soma UFC',
}

export default function PerfilPage() {
  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <ProfileView />
    </div>
  )
}
