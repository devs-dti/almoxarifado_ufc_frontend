import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'


export const metadata: Metadata = {
  title: 'SIGMA | UFC Sobral',
  description: 'SIGMA — Sistema de Gestão de Materiais e Almoxarifado da UFC Sobral.',
  icons: { icon: '/sigma-logo.png', shortcut: '/sigma-logo.png', apple: '/sigma-logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background antialiased overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
