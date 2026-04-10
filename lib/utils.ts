import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function excelToDate(serial: number | null | undefined): Date | null {
  if (!serial || typeof serial !== 'number') return null
  return new Date(Math.round((serial - 25569) * 86400 * 1000))
}

export function formatDate(serial: number | null | undefined): string {
  const d = excelToDate(serial)
  if (!d) return '—'
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function isOverdue(serial: number | null | undefined): boolean {
  const d = excelToDate(serial)
  if (!d) return false
  return d < new Date()
}

export function daysUntil(serial: number | null | undefined): number | null {
  const d = excelToDate(serial)
  if (!d) return null
  return Math.round((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

// Automation: compute Attente DP based on dateEnvoi + statut
export function computeAttenteDP(dateEnvoiSerial: number | null, statut: string): Date | null {
  const d = excelToDate(dateEnvoiSerial)
  if (!d) return null
  const result = new Date(d)
  const isABF = statut.toUpperCase().includes('ABF')
  result.setMonth(result.getMonth() + (isABF ? 2 : 1))
  return result
}
