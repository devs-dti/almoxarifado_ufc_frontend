import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Almoxarifado UFC',
  description: 'Sistema de almoxarifado',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background antialiased overflow-x-hidden">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
