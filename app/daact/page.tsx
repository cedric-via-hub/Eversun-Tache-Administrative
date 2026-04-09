'use client'

import { useState, useMemo } from 'react'
import { FileCheck2 } from 'lucide-react'
import { daactData } from '@/data/mockData'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'

export default function DAACTPage() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return daactData
    return daactData.filter(d =>
      d.client.toLowerCase().includes(search.toLowerCase()) ||
      d.numeroDp.toLowerCase().includes(search.toLowerCase()) ||
      d.ville.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const done = daactData.filter(d => d.daact).length

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      <PageHeader
        icon={FileCheck2}
        iconColor="text-violet-400"
        title="DAACT"
        subtitle="Déclarations d'achèvement et de conformité des travaux"
        badge={daactData.length}
      />

      {/* Automation */}
      <div className="rounded-xl bg-violet-500/5 border border-violet-500/15 p-4 text-xs text-slate-400 leading-relaxed">
        <span className="text-violet-400 font-medium">Automatisation DAACT :</span>{' '}
        Les dossiers dont la case <span className="font-mono text-violet-300">DAACT (col. L)</span> est cochée dans "DP – Accordés"
        sont transférés ici avec le client, le numéro DP et la ville. La case est ensuite remplacée par <span className="font-mono text-white">"Archivé"</span>.
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0b1628] border border-violet-500/15 p-5 text-center">
          <p className="text-3xl font-bold text-violet-400">{done}</p>
          <p className="text-xs text-slate-500 mt-1">DAACT déposées</p>
        </div>
        <div className="rounded-xl bg-[#0b1628] border border-emerald-500/15 p-5 text-center">
          <p className="text-3xl font-bold text-emerald-400">
            {Math.round(done / daactData.length * 100)}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Taux de complétion</p>
        </div>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Client, numéro DP, ville…" className="w-64" />

      <div className="rounded-2xl bg-[#0b1628] border border-white/6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">#</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Client</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Numéro DP</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Ville</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">DAACT</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id} className="border-b border-white/3 table-row-hover transition-colors">
                  <td className="px-5 py-3 text-slate-600 text-xs font-mono">{String(i + 1).padStart(2, '0')}</td>
                  <td className="px-5 py-3 font-semibold text-white">{d.client}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-400">{d.numeroDp}</td>
                  <td className="px-5 py-3 text-slate-300">{d.ville}</td>
                  <td className="px-5 py-3">
                    {d.daact ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium">
                        <FileCheck2 size={10} /> Déposée
                      </span>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700/30 text-slate-600 border border-white/4">En attente</span>
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
