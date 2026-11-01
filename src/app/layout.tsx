import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'


export const metadata: Metadata = {
  title: 'Almoxarifado UFC',
  description: 'Sistema de almoxarifado',
  icons: { icon: '/ufc-brasao.png', shortcut: '/ufc-brasao.png', apple: '/ufc-brasao.png' },
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
