'use client'

import { useState, useMemo } from 'react'
import { CheckCircle2, FileCheck2, Archive } from 'lucide-react'
import { dpAccordes } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import StatusBadge from '@/components/StatusBadge'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'

export default function DPAccordesPage() {
  const [search, setSearch] = useState('')
  const [filterDaact, setFilterDaact] = useState<'all' | 'archive' | 'pending'>('all')

  const filtered = useMemo(() => {
    return dpAccordes.filter(d => {
      const matchSearch =
        d.client.toLowerCase().includes(search.toLowerCase()) ||
        d.numeroDp.toLowerCase().includes(search.toLowerCase()) ||
        d.ville.toLowerCase().includes(search.toLowerCase())
      const matchDaact =
        filterDaact === 'all' ||
        (filterDaact === 'archive' && d.daact === 'Archivé') ||
        (filterDaact === 'pending' && d.daact !== 'Archivé')
      return matchSearch && matchDaact
    })
  }, [search, filterDaact])

  const archived = dpAccordes.filter(d => d.daact === 'Archivé').length
  const pending  = dpAccordes.filter(d => d.daact !== 'Archivé').length

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      <PageHeader
        icon={CheckCircle2}
        iconColor="text-emerald-400"
        title="DP – Accordés"
        subtitle="Déclarations préalables avec accord favorable"
        badge={dpAccordes.length}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-[#0b1628] border border-emerald-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{dpAccordes.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total accordés</p>
        </div>
        <div className="rounded-xl bg-[#0b1628] border border-violet-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-violet-400">{archived}</p>
          <p className="text-xs text-slate-500 mt-1">DAACT archivés</p>
        </div>
        <div className="rounded-xl bg-[#0b1628] border border-amber-500/15 p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{pending}</p>
          <p className="text-xs text-slate-500 mt-1">DAACT en attente</p>
        </div>
      </div>

      {/* Automation note */}
      <div className="rounded-xl bg-violet-500/5 border border-violet-500/15 p-4 flex items-start gap-3">
        <Archive size={14} className="text-violet-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="text-violet-400 font-medium">Automatisation DAACT :</span>{' '}
          Cocher la colonne <span className="font-mono text-violet-300">DAACT</span> en colonne L déclenche l'archivage vers l'onglet <span className="font-mono">✅ DAACT</span>.
          Les cases cochées sont remplacées par "Archivé".
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Client, numéro, ville…" className="w-64" />
        <div className="flex gap-2">
          {[
            { key: 'all',     label: `Tous (${dpAccordes.length})` },
            { key: 'archive', label: `DAACT archivé (${archived})` },
            { key: 'pending', label: `DAACT en attente (${pending})` },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setFilterDaact(opt.key as 'all' | 'archive' | 'pending')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filterDaact === opt.key
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'text-slate-400 border-white/8 hover:border-white/20'
              }`}
            >
              {opt.label}
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
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Statut</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">DAACT</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(dp => (
                <tr key={dp.id} className="border-b border-white/3 table-row-hover transition-colors">
                  <td className="px-5 py-3 font-semibold text-white">{dp.client}</td>
                  <td className="px-5 py-3 text-slate-400 font-mono text-xs">{dp.numeroDp}</td>
                  <td className="px-5 py-3 text-slate-300">{dp.ville}</td>
                  <td className="px-5 py-3 text-slate-400">{dp.presta}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300">{dp.financement}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{formatDate(dp.dateEnvoi)}</td>
                  <td className="px-5 py-3"><StatusBadge statut={dp.statut} size="xs" /></td>
                  <td className="px-5 py-3">
                    {dp.daact === 'Archivé' ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        <FileCheck2 size={10} /> Archivé
                      </span>
                    ) : dp.daact === true ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✓ Coché</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/30 text-slate-600 border border-white/4">En attente</span>
                    )}
                  </td>
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
