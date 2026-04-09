'use client'

import { useState, useMemo } from 'react'
import { ClipboardList, Clock, AlertTriangle, Zap } from 'lucide-react'
import { dpEnCours } from '@/data/mockData'
import { formatDate, isOverdue, daysUntil, computeAttenteDP } from '@/lib/utils'
import StatusBadge from '@/components/StatusBadge'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'

export default function DPEnCoursPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')

  const statuts = [...new Set(dpEnCours.map(d => d.statut))]

  const filtered = useMemo(() => {
    return dpEnCours.filter(d => {
      const matchSearch =
        d.client.toLowerCase().includes(search.toLowerCase()) ||
        d.numeroDp.toLowerCase().includes(search.toLowerCase()) ||
        d.ville.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'all' || d.statut === filter
      return matchSearch && matchFilter
    })
  }, [search, filter])

  const overdue = filtered.filter(d => isOverdue(d.attenteDP))
  const abfCount = filtered.filter(d => d.statut.toUpperCase().includes('ABF'))

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      <PageHeader
        icon={ClipboardList}
        iconColor="text-blue-400"
        title="DP – En cours"
        subtitle="Déclarations préalables en cours d'instruction"
        badge={filtered.length}
      />

      {/* Automation info */}
      <div className="rounded-xl bg-blue-500/5 border border-blue-500/15 p-4 flex items-start gap-3">
        <Zap size={14} className="text-blue-400 mt-0.5 shrink-0" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <span className="text-blue-400 font-medium">Automatisation active :</span>{' '}
          La colonne <span className="font-mono text-blue-300">Attente DP</span> est calculée automatiquement à partir de la date d'envoi.
          Délai de <span className="font-semibold text-white">2 mois</span> si ABF, sinon <span className="font-semibold text-white">1 mois</span>.
        </div>
      </div>

      {/* Alerts summary */}
      {overdue.length > 0 && (
        <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4 flex items-center gap-3">
          <AlertTriangle size={14} className="text-red-400 shrink-0" />
          <p className="text-xs text-red-400">
            <span className="font-semibold">{overdue.length} dossier(s)</span> dont la date d'attente est dépassée.
          </p>
        </div>
      )}

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-[#0b1628] border border-white/6 p-4 text-center">
          <p className="text-2xl font-bold text-white">{filtered.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total en cours</p>
        </div>
        <div className="rounded-xl bg-[#0b1628] border border-amber-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{abfCount.length}</p>
          <p className="text-xs text-slate-500 mt-1">Dossiers ABF</p>
        </div>
        <div className="rounded-xl bg-[#0b1628] border border-red-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{overdue.length}</p>
          <p className="text-xs text-slate-500 mt-1">Délais dépassés</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Client, numéro DP, ville…" className="w-64" />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === 'all' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'text-slate-400 border-white/8 hover:border-white/20'}`}
          >
            Tous ({dpEnCours.length})
          </button>
          {statuts.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === s ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'text-slate-400 border-white/8 hover:border-white/20'}`}
            >
              {s} ({dpEnCours.filter(d => d.statut === s).length})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
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
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Date envoi</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> Attente DP
                  </span>
                </th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Statut</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Accès</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(dp => {
                const computed = computeAttenteDP(dp.dateEnvoi, dp.statut)
                const over = isOverdue(dp.attenteDP)
                const days = daysUntil(dp.attenteDP)
                return (
                  <tr key={dp.id} className={`border-b border-white/3 table-row-hover transition-colors ${over ? 'bg-red-950/10' : ''}`}>
                    <td className="px-5 py-3 font-semibold text-white">{dp.client}</td>
                    <td className="px-5 py-3 text-slate-400 font-mono text-xs">{dp.numeroDp}</td>
                    <td className="px-5 py-3 text-slate-300">{dp.ville}</td>
                    <td className="px-5 py-3 text-slate-400">{dp.presta}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300">{dp.financement}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{formatDate(dp.dateEnvoi)}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-sm font-medium ${over ? 'text-red-400' : 'text-slate-300'}`}>
                          {formatDate(dp.attenteDP)}
                        </span>
                        {days !== null && (
                          <span className={`text-[10px] ${over ? 'text-red-500' : days < 7 ? 'text-amber-500' : 'text-slate-600'}`}>
                            {over ? `${Math.abs(days)}j de retard` : `dans ${days}j`}
                          </span>
                        )}
                        {computed && dp.dateEnvoi && (
                          <span className="text-[10px] text-blue-600">auto: {computed.toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3"><StatusBadge statut={dp.statut} size="xs" /></td>
                    <td className="px-5 py-3">
                      {dp.siteDp ? (
                        <a
                          href={dp.siteDp.split('//').pop()?.startsWith('http') ? dp.siteDp : `https://${dp.siteDp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                        >
                          Portail ↗
                        </a>
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
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
