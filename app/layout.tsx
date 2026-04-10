import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { DataProvider } from '@/lib/DataContext'

export const metadata: Metadata = {
  title: 'DP Dashboard – Suivi Administratif',
  description: 'Dashboard de suivi des déclarations préalables, raccordements, consuels et DAACT',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex h-screen overflow-hidden bg-[#0a0f1e]" suppressHydrationWarning>
        <DataProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </DataProvider>
      </body>
    </html>
  )
}
