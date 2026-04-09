'use client'

import { useState } from 'react'
import { XCircle } from 'lucide-react'
import { dpRefus } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import StatusBadge from '@/components/StatusBadge'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'

export default function DPRefusPage() {
  const [search, setSearch] = useState('')

  const filtered = dpRefus.filter(d =>
    d.client.toLowerCase().includes(search.toLowerCase()) ||
    d.numeroDp.toLowerCase().includes(search.toLowerCase()) ||
    d.ville.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      <PageHeader
        icon={XCircle}
        iconColor="text-red-400"
        title="DP – Refus"
        subtitle="Déclarations préalables ayant reçu un avis de refus"
        badge={dpRefus.length}
      />

      <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4">
        <p className="text-xs text-red-400 leading-relaxed">
          Ces dossiers ont reçu une décision de refus. Ils sont archivés ici automatiquement lorsque le statut passe à <span className="font-mono font-semibold">"Refus"</span> dans l'onglet DP – En cours.
        </p>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Client, numéro, ville…" className="w-64" />

      <div className="rounded-2xl bg-[#0b1628] border border-red-500/10 overflow-hidden">
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
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Attente DP</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Statut</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium">Portail</th>
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
                  <td className="px-5 py-3 text-slate-400">{formatDate(dp.attenteDP)}</td>
                  <td className="px-5 py-3"><StatusBadge statut={dp.statut} size="xs" /></td>
                  <td className="px-5 py-3">
                    {dp.siteDp ? (
                      <a href={dp.siteDp} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                        Portail ↗
                      </a>
                    ) : <span className="text-slate-700">—</span>}
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
