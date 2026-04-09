'use client'

import { useState, useMemo } from 'react'
import { Zap } from 'lucide-react'
import { raccordementEnCours, raccordementMES } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import StatusBadge from '@/components/StatusBadge'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'

type Tab = 'encours' | 'mes'

export default function RaccordementPage() {
  const [tab, setTab] = useState<Tab>('encours')
  const [search, setSearch] = useState('')

  const data = tab === 'encours' ? raccordementEnCours : raccordementMES

  const filtered = useMemo(() => {
    if (!search) return data
    return data.filter(d =>
      d.client.toLowerCase().includes(search.toLowerCase()) ||
      d.ville.toLowerCase().includes(search.toLowerCase()) ||
      d.numeroDp.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  const attenteEnedis = raccordementEnCours.filter(d => d.statut === 'En attente Enedis').length
  const raccordeEnAttente = raccordementEnCours.filter(d => d.statut === 'Raccordé').length
  const consuelOk = raccordementEnCours.filter(d => d.statut === 'Consuel OK').length

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      <PageHeader
        icon={Zap}
        iconColor="text-amber-400"
        title="Raccordement"
        subtitle="Suivi des raccordements réseau et mises en service"
      />

      {/* Automation note */}
      <div className="rounded-xl bg-amber-500/5 border border-amber-500/15 p-4 text-xs text-slate-400 leading-relaxed">
        <span className="text-amber-400 font-medium">Automatisation :</span>{' '}
        Un dossier est déplacé vers <span className="font-mono text-amber-300">Raccordement – MES</span> quand le statut est <span className="font-mono text-white">"Mise en service"</span>.
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl bg-[#0b1628] border border-amber-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{attenteEnedis}</p>
          <p className="text-xs text-slate-500 mt-1">Att. Enedis</p>
        </div>
        <div className="rounded-xl bg-[#0b1628] border border-cyan-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">{consuelOk}</p>
          <p className="text-xs text-slate-500 mt-1">Consuel OK</p>
        </div>
        <div className="rounded-xl bg-[#0b1628] border border-teal-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-teal-400">{raccordeEnAttente}</p>
          <p className="text-xs text-slate-500 mt-1">Raccordé (att. MES)</p>
        </div>
        <div className="rounded-xl bg-[#0b1628] border border-violet-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-violet-400">{raccordementMES.length}</p>
          <p className="text-xs text-slate-500 mt-1">MES effectués</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([
          ['encours', `En cours (${raccordementEnCours.length})`],
          ['mes', `MES – Mis en service (${raccordementMES.length})`]
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`text-sm px-4 py-2 rounded-xl border transition-colors ${
              tab === key
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'text-slate-400 border-white/8 hover:border-white/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Client, ville, numéro DP…" className="w-64" />

      <div className="rounded-2xl bg-[#0b1628] border border-white/6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Client</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Numéro DP</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Ville</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Prestataire</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Financement</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Dépôt</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Statut</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-white/3 table-row-hover transition-colors">
                  <td className="px-5 py-3 font-semibold text-white">{r.client}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-400">{r.numeroDp}</td>
                  <td className="px-5 py-3 text-slate-300">{r.ville}</td>
                  <td className="px-5 py-3 text-slate-400">{r.presta}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300">{r.financement}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{formatDate(r.dateDepot)}</td>
                  <td className="px-5 py-3"><StatusBadge statut={r.statut} size="xs" /></td>
                  <td className="px-5 py-3 text-slate-500 text-xs max-w-[200px] truncate">{r.commentaires || '—'}</td>
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
