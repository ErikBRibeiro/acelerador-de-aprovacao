import type { Metadata } from 'next'
import './globals.css'
import { SeedProgress } from '@/components/SeedProgress'

export const metadata: Metadata = {
  title: 'Acelerador de Aprovação',
  description: 'Plataforma de preparação para intérpretes em processos seletivos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <SeedProgress />
        {children}
      </body>
    </html>
  )
}
