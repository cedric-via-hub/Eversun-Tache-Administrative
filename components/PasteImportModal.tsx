'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, ClipboardPaste, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SheetType = 'dp' | 'consuel' | 'raccordement' | 'daact'

interface PasteImportModalProps {
  open: boolean
  onClose: () => void
  onImport: (rows: Record<string, string>[]) => void
  sheetType: SheetType
}

// Expected column headers per sheet type
const COLUMN_DEFS: Record<SheetType, string[]> = {
  dp: ['Client', 'Date d\'envoi DP', 'Attente DP', 'Presta', 'Financement', 'Statut', 'Numéro DP', 'Ville', 'Site DP', 'Email', 'Mot de passe'],
  consuel: ['Nom', 'Prénom', 'Contrat abonné', 'Date signature', 'Date MES', 'Cause absence', 'Prestataire', 'État', 'Type Consuel', 'Date dernière démarche', 'Commentaires', 'Date estimative', 'Client informé', 'MES'],
  raccordement: ['Client', 'Numéro DP', 'Ville', 'Presta', 'Financement', 'Date dépôt', 'Statut', 'Commentaires'],
  daact: ['Client', 'Numéro DP', 'Ville', 'DAACT'],
}

const SHEET_LABELS: Record<SheetType, string> = {
  dp: 'DP (En cours / Accordés / Refus)',
  consuel: 'Consuel',
  raccordement: 'Raccordement',
  daact: 'DAACT',
}

function parseTSV(text: string): string[][] {
  return text
    .split('\n')
    .map(line => line.split('\t').map(cell => cell.replace(/\r/g, '').trim()))
    .filter(row => row.some(cell => cell !== ''))
}

function parseCSV(text: string): string[][] {
  return text
    .split('\n')
    .map(line => line.split(',').map(cell => cell.replace(/\r/g, '').trim().replace(/^"|"$/g, '')))
    .filter(row => row.some(cell => cell !== ''))
}

export default function PasteImportModal({ open, onClose, onImport, sheetType }: PasteImportModalProps) {
  const [pasteText, setPasteText] = useState('')
  const [preview, setPreview] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [mapping, setMapping] = useState<Record<number, string>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const columns = COLUMN_DEFS[sheetType]

  const parse = useCallback((text: string) => {
    setError(null)
    if (!text.trim()) { setPreview([]); setHeaders([]); return }

    const isCSV = !text.includes('\t') && text.includes(',')
    const rows = isCSV ? parseCSV(text) : parseTSV(text)

    if (rows.length === 0) { setError('Aucune donnée détectée.'); return }

    // Auto-detect if first row is a header
    const firstRow = rows[0]
    const looksLikeHeader = firstRow.some(cell =>
      columns.some(col => col.toLowerCase().includes(cell.toLowerCase().slice(0, 4)) && cell.length > 1)
    )

    let dataRows: string[][]
    let detectedHeaders: string[]

    if (looksLikeHeader) {
      detectedHeaders = firstRow
      dataRows = rows.slice(1)
    } else {
      detectedHeaders = firstRow.map((_, i) => `Colonne ${i + 1}`)
      dataRows = rows
    }

    // Auto-map detected headers to our schema
    const autoMapping: Record<number, string> = {}
    detectedHeaders.forEach((h, i) => {
      const lower = h.toLowerCase()
      const match = columns.find(col =>
        col.toLowerCase().includes(lower.slice(0, 5)) ||
        lower.includes(col.toLowerCase().slice(0, 5))
      )
      if (match) autoMapping[i] = match
    })

    setHeaders(detectedHeaders)
    setMapping(autoMapping)
    setPreview(dataRows.slice(0, 5))
  }, [columns])

  useEffect(() => { parse(pasteText) }, [pasteText, parse])

  useEffect(() => {
    if (open) {
      setPasteText('')
      setPreview([])
      setHeaders([])
      setError(null)
      setMapping({})
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [open])

  function handleImport() {
    if (preview.length === 0) return
    const isCSV = !pasteText.includes('\t') && pasteText.includes(',')
    const rows = isCSV ? parseCSV(pasteText) : parseTSV(pasteText)
    const looksLikeHeader = rows[0]?.some(cell =>
      columns.some(col => col.toLowerCase().includes(cell.toLowerCase().slice(0, 4)) && cell.length > 1)
    )
    const dataRows = looksLikeHeader ? rows.slice(1) : rows

    const mapped = dataRows.map(row => {
      const obj: Record<string, string> = {}
      Object.entries(mapping).forEach(([colIdx, fieldName]) => {
        obj[fieldName] = row[Number(colIdx)] ?? ''
      })
      // Also include raw columns
      row.forEach((val, i) => { if (!obj[`col_${i}`]) obj[`col_${i}`] = val })
      return obj
    })

    onImport(mapped)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-[#0d1b35] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <div className="flex items-center gap-2">
            <ClipboardPaste size={16} className="text-emerald-400" />
            <p className="text-sm font-semibold text-white">Importer — {SHEET_LABELS[sheetType]}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={16} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Instructions */}
          <div className="rounded-xl bg-blue-500/5 border border-blue-500/15 p-3 flex gap-2">
            <Info size={13} className="text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Copiez les cellules depuis <span className="text-white font-medium">Google Sheets</span> ou <span className="text-white font-medium">Excel</span> (avec ou sans en-têtes) puis collez ci-dessous.
              Les colonnes sont détectées automatiquement.
            </p>
          </div>

          {/* Expected columns hint */}
          <div>
            <p className="text-xs text-slate-600 mb-1.5">Colonnes attendues :</p>
            <div className="flex flex-wrap gap-1">
              {columns.map(c => (
                <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-white/4 text-slate-500 font-mono">{c}</span>
              ))}
            </div>
          </div>

          {/* Paste area */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Coller ici (Ctrl+V / Cmd+V)</label>
            <textarea
              ref={textareaRef}
              value={pasteText}
              onChange={e => setPasteText(e.target.value)}
              placeholder="Collez vos données ici…"
              rows={6}
              className="w-full bg-[#060d1f] border border-white/8 rounded-xl px-4 py-3 text-xs text-slate-300 font-mono placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/40 resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2">
              <AlertCircle size={12} /> {error}
            </div>
          )}

          {/* Column mapping */}
          {headers.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2">Correspondance des colonnes</p>
              <div className="grid grid-cols-2 gap-2">
                {headers.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/2 rounded-lg px-3 py-2">
                    <span className="text-[10px] text-slate-600 font-mono w-20 truncate shrink-0">{h}</span>
                    <span className="text-slate-700">→</span>
                    <select
                      value={mapping[i] ?? ''}
                      onChange={e => setMapping(prev => ({ ...prev, [i]: e.target.value }))}
                      className="flex-1 bg-transparent text-xs text-emerald-400 focus:outline-none"
                    >
                      <option value="">— Ignorer —</option>
                      {columns.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2">Aperçu ({preview.length} lignes affichées)</p>
              <div className="overflow-x-auto rounded-xl border border-white/6">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/2">
                      {headers.map((h, i) => (
                        <th key={i} className="text-left px-3 py-2 text-slate-500 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, ri) => (
                      <tr key={ri} className="border-b border-white/3">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-2 text-slate-400 max-w-[120px] truncate">{cell || '—'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/6 bg-white/2">
          <button onClick={onClose} className="text-xs text-slate-500 hover:text-white transition-colors">Annuler</button>
          <button
            onClick={handleImport}
            disabled={preview.length === 0}
            className={cn(
              'flex items-center gap-2 text-xs px-4 py-2 rounded-xl font-medium transition-colors',
              preview.length > 0
                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                : 'bg-white/4 text-slate-600 cursor-not-allowed'
            )}
          >
            <CheckCircle2 size={13} />
            Importer {preview.length > 0 ? `(${preview.length}+ lignes)` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
