'use client'

import { useState, useMemo } from 'react'
import { BadgeCheck } from 'lucide-react'
import { consuelEnCours, consuelFinalise } from '@/data/mockData'
import { formatDate, isOverdue } from '@/lib/utils'
import StatusBadge from '@/components/StatusBadge'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'

type Tab = 'encours' | 'finalise'

export default function ConsuelPage() {
  const [tab, setTab] = useState<Tab>('encours')
  const [search, setSearch] = useState('')

  const data = tab === 'encours' ? consuelEnCours : consuelFinalise

  const filtered = useMemo(() => {
    if (!search) return data
    return data.filter(d =>
      d.nom.toLowerCase().includes(search.toLowerCase()) ||
      d.prenom.toLowerCase().includes(search.toLowerCase()) ||
      d.contrat.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      <PageHeader
        icon={BadgeCheck}
        iconColor="text-cyan-400"
        title="Consuel"
        subtitle="Suivi des attestations de conformité électrique"
      />

      {/* Automation */}
      <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/15 p-4 text-xs text-slate-400 leading-relaxed">
        <span className="text-cyan-400 font-medium">Automatisation :</span>{' '}
        Un dossier est archivé vers <span className="font-mono text-cyan-300">Consuel – Finalisé</span> quand{' '}
        <span className="font-mono text-white">Cause = "Consuel envoyé"</span> ET <span className="font-mono text-white">État = "Consuel OK"</span>.
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl bg-[#0b1628] border border-cyan-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">{consuelEnCours.length}</p>
          <p className="text-xs text-slate-500 mt-1">En cours</p>
        </div>
        <div className="rounded-xl bg-[#0b1628] border border-emerald-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{consuelFinalise.length}</p>
          <p className="text-xs text-slate-500 mt-1">Finalisés</p>
        </div>
        <div className="rounded-xl bg-[#0b1628] border border-blue-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">
            {consuelEnCours.filter(d => d.typeConsuel === 'Bleu').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Consuel Bleu</p>
        </div>
        <div className="rounded-xl bg-[#0b1628] border border-red-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-red-400">
            {consuelEnCours.filter(d => d.typeConsuel === 'Rouge').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Consuel Rouge</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([['encours', `En cours (${consuelEnCours.length})`], ['finalise', `Finalisés (${consuelFinalise.length})`]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`text-sm px-4 py-2 rounded-xl border transition-colors ${
              tab === key
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'text-slate-400 border-white/8 hover:border-white/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Nom, prénom, contrat…" className="w-64" />

      {/* Table */}
      <div className="rounded-2xl bg-[#0b1628] border border-white/6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Nom / Prénom</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Contrat</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Prestataire</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Type</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">MES</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Dernière démarche</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Date estimative</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">État</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Client informé</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-white/3 table-row-hover transition-colors">
                  <td className="px-5 py-3 font-semibold text-white">{c.nom} <span className="text-slate-400 font-normal">{c.prenom}</span></td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-400">{c.contrat}</td>
                  <td className="px-5 py-3 text-slate-400">{c.prestataire}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      c.typeConsuel === 'Bleu'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {c.typeConsuel}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{formatDate(c.dateMES)}</td>
                  <td className={`px-5 py-3 ${isOverdue(c.dateDerniereDemarche) ? 'text-red-400' : 'text-slate-400'}`}>
                    {formatDate(c.dateDerniereDemarche)}
                  </td>
                  <td className="px-5 py-3 text-slate-300">{formatDate(c.dateEstimative)}</td>
                  <td className="px-5 py-3"><StatusBadge statut={c.etat} size="xs" /></td>
                  <td className="px-5 py-3">
                    {c.clientInforme
                      ? <span className="text-xs text-emerald-400">✓ Oui</span>
                      : <span className="text-xs text-slate-600">Non</span>
                    }
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs max-w-[200px] truncate">{c.commentaires || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-600 text-sm">Aucun résultat</div>
        )}
      </div>
    </div>
  )
}
