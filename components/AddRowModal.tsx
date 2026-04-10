'use client'

import { useState, useEffect } from 'react'
import { X, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SheetType } from './PasteImportModal'

interface Field { key: string; label: string; type?: 'text' | 'select' | 'date'; options?: string[]; required?: boolean }

const FIELDS: Record<SheetType, Field[]> = {
  dp: [
    { key: 'client',      label: 'Client',        required: true },
    { key: 'numeroDp',    label: 'Numéro DP' },
    { key: 'ville',       label: 'Ville' },
    { key: 'presta',      label: 'Prestataire',   type: 'select', options: ['Eversun', 'Dessineo'] },
    { key: 'financement', label: 'Financement',   type: 'select', options: ['SunLib', 'Otovo', 'Autre'] },
    { key: 'statut',      label: 'Statut',        type: 'select', options: ["En cours d'instruction", 'Accord favorable', 'Refus', 'ABF', 'ABF favorable', 'En attente'] },
    { key: 'dateEnvoi',   label: 'Date d\'envoi', type: 'date' },
    { key: 'siteDp',      label: 'Site / Portail DP' },
    { key: 'email',       label: 'Email utilisé' },
  ],
  consuel: [
    { key: 'nom',         label: 'Nom',           required: true },
    { key: 'prenom',      label: 'Prénom' },
    { key: 'contrat',     label: 'N° Contrat' },
    { key: 'prestataire', label: 'Prestataire',   type: 'select', options: ['Eversun', 'Dessineo'] },
    { key: 'typeConsuel', label: 'Type Consuel',  type: 'select', options: ['Bleu', 'Rouge'] },
    { key: 'etat',        label: 'État',          type: 'select', options: ['En attente', 'Consuel OK', 'Refusé'] },
    { key: 'causeAbsence',label: 'Cause',         type: 'select', options: ['Consuel envoyé', 'Non présent', 'Autre'] },
    { key: 'dateMES',     label: 'Date MES',      type: 'date' },
    { key: 'commentaires',label: 'Commentaires' },
  ],
  raccordement: [
    { key: 'client',      label: 'Client',        required: true },
    { key: 'numeroDp',    label: 'Numéro DP' },
    { key: 'ville',       label: 'Ville' },
    { key: 'presta',      label: 'Prestataire',   type: 'select', options: ['Eversun', 'Dessineo'] },
    { key: 'financement', label: 'Financement',   type: 'select', options: ['SunLib', 'Otovo', 'Autre'] },
    { key: 'statut',      label: 'Statut',        type: 'select', options: ['En attente Enedis', 'Consuel OK', 'Raccordé', 'Mise en service'] },
    { key: 'dateDepot',   label: 'Date dépôt',    type: 'date' },
    { key: 'commentaires',label: 'Commentaires' },
  ],
  daact: [
    { key: 'client',   label: 'Client',    required: true },
    { key: 'numeroDp', label: 'Numéro DP' },
    { key: 'ville',    label: 'Ville' },
  ],
}

interface AddRowModalProps {
  open: boolean
  onClose: () => void
  onAdd: (data: Record<string, string>) => void
  sheetType: SheetType
}

export default function AddRowModal({ open, onClose, onAdd, sheetType }: AddRowModalProps) {
  const [form, setForm] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<string[]>([])
  const fields = FIELDS[sheetType]

  useEffect(() => {
    if (open) {
      setForm({})
      setErrors([])
    }
  }, [open])

  function handleSubmit() {
    const missing = fields.filter(f => f.required && !form[f.key])
    if (missing.length) { setErrors(missing.map(f => f.label)); return }
    onAdd(form)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0d1b35] border border-white/10 rounded-2xl shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <div className="flex items-center gap-2">
            <UserPlus size={15} className="text-emerald-400" />
            <p className="text-sm font-semibold text-white">Ajouter un dossier</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={16} /></button>
        </div>

        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {errors.length > 0 && (
            <div className="text-xs text-red-400 bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2">
              Champs requis : {errors.join(', ')}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {fields.map(f => (
              <div key={f.key} className={f.key === 'commentaires' || f.key === 'siteDp' ? 'col-span-2' : ''}>
                <label className="text-[10px] text-slate-500 uppercase tracking-wide mb-1 block">
                  {f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                {f.type === 'select' ? (
                  <select
                    value={form[f.key] ?? ''}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-[#060d1f] border border-white/8 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                  >
                    <option value="">— Choisir —</option>
                    {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type === 'date' ? 'date' : 'text'}
                    value={form[f.key] ?? ''}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.label}
                    className="w-full bg-[#060d1f] border border-white/8 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/40"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-white/6 bg-white/2">
          <button onClick={onClose} className="text-xs text-slate-500 hover:text-white transition-colors">Annuler</button>
          <button onClick={handleSubmit}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors">
            <UserPlus size={12} /> Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}
