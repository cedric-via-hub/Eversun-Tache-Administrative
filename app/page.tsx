import {
  ClipboardList, CheckCircle2, XCircle, Zap,
  BadgeCheck, FileCheck2, TrendingUp, AlertTriangle,
  Clock, Activity
} from 'lucide-react'
import KpiCard from '@/components/KpiCard'
import { getStats, dpEnCours, consuelEnCours, raccordementEnCours } from '@/data/mockData'
import { formatDate, isOverdue } from '@/lib/utils'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'

export default function DashboardPage() {
  const stats = getStats()

  const overdueDPs = dpEnCours.filter(d => isOverdue(d.attenteDP))
  const urgentConsuel = consuelEnCours.filter(d => isOverdue(d.dateDerniereDemarche))

  return (
    <div className="p-8 space-y-8 animate-slide-up">
      {/* Header */}
      <div>
        <p className="text-xs text-emerald-500 font-semibold tracking-widest uppercase mb-1">Tableau de bord</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Suivi Administratif</h1>
        <p className="text-slate-500 text-sm mt-1">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPIs row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="DP en cours"    value={stats.dpEnCours}    subtitle={`dont ${stats.dpEnCoursABF} ABF`}  icon={ClipboardList} accent="blue"    className="animate-slide-up stagger-1" />
        <KpiCard title="DP accordés"    value={stats.dpAccordes}   subtitle={`${stats.tauxAccord}% taux accord`} icon={CheckCircle2}  accent="emerald" className="animate-slide-up stagger-2" />
        <KpiCard title="DP refusés"     value={stats.dpRefus}      subtitle="À analyser"                         icon={XCircle}       accent="red"     className="animate-slide-up stagger-3" />
        <KpiCard title="Taux d'accord"  value={`${stats.tauxAccord}%`} subtitle="DP traités"                    icon={TrendingUp}    accent="emerald" className="animate-slide-up stagger-4" />
      </div>

      {/* KPIs row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Raccordements"  value={stats.raccordementEnAttente} subtitle="En attente Enedis"         icon={Zap}           accent="amber"   className="animate-slide-up stagger-1" />
        <KpiCard title="MES effectués"  value={stats.raccordementMES}       subtitle="Mis en service"            icon={Activity}      accent="cyan"    className="animate-slide-up stagger-2" />
        <KpiCard title="Consuels"       value={stats.consuelEnAttente}      subtitle="En cours"                  icon={BadgeCheck}    accent="cyan"    className="animate-slide-up stagger-3" />
        <KpiCard title="DAACT archivés" value={stats.daactArchives}         subtitle={`/ ${stats.daactTotal} accordés`} icon={FileCheck2} accent="violet" className="animate-slide-up stagger-4" />
      </div>

      {/* Progress bars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pipeline DP */}
        <div className="col-span-2 rounded-2xl bg-[#0b1628] border border-white/6 p-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Pipeline DP</p>
          <div className="space-y-3">
            {[
              { label: 'En cours',  value: stats.dpEnCours,  total: stats.dpEnCours + stats.dpAccordes + stats.dpRefus, color: 'bg-blue-500' },
              { label: 'Accordés',  value: stats.dpAccordes, total: stats.dpEnCours + stats.dpAccordes + stats.dpRefus, color: 'bg-emerald-500' },
              { label: 'Refusés',   value: stats.dpRefus,    total: stats.dpEnCours + stats.dpAccordes + stats.dpRefus, color: 'bg-red-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-slate-300 font-medium">{item.value}</span>
                </div>
                <div className="h-2 bg-white/4 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                    style={{ width: `${Math.round(item.value / item.total * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* DAACT progress */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Avancement DAACT</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-white/4 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-1000"
                  style={{ width: `${Math.round(stats.daactArchives / stats.daactTotal * 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-violet-400 shrink-0">
                {Math.round(stats.daactArchives / stats.daactTotal * 100)}%
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{stats.daactArchives} archivés sur {stats.daactTotal} accordés</p>
          </div>
        </div>

        {/* Alertes */}
        <div className="rounded-2xl bg-[#0b1628] border border-amber-500/15 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} className="text-amber-400" />
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest">Alertes</p>
          </div>
          <div className="space-y-3">
            {overdueDPs.slice(0, 4).map(dp => (
              <div key={dp.id} className="flex items-start gap-2 p-2.5 rounded-xl bg-red-500/5 border border-red-500/10">
                <Clock size={12} className="text-red-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-300 truncate">{dp.client}</p>
                  <p className="text-[10px] text-slate-600">DP échue {formatDate(dp.attenteDP)}</p>
                </div>
              </div>
            ))}
            {urgentConsuel.slice(0, 2).map(c => (
              <div key={c.id} className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <BadgeCheck size={12} className="text-amber-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-300 truncate">{c.nom} {c.prenom}</p>
                  <p className="text-[10px] text-slate-600">Consuel en retard</p>
                </div>
              </div>
            ))}
            {overdueDPs.length === 0 && urgentConsuel.length === 0 && (
              <p className="text-xs text-slate-600 text-center py-4">Aucune alerte active</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent activity table */}
      <div className="rounded-2xl bg-[#0b1628] border border-white/6 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <p className="text-sm font-semibold text-white">DP En cours — Aperçu</p>
          <Link href="/dp-en-cours" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
            Voir tout →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Client</th>
                <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Numéro DP</th>
                <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Ville</th>
                <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Envoi</th>
                <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Échéance</th>
                <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {dpEnCours.slice(0, 8).map(dp => (
                <tr key={dp.id} className="border-b border-white/3 table-row-hover transition-colors">
                  <td className="px-6 py-3 font-medium text-white">{dp.client}</td>
                  <td className="px-6 py-3 text-slate-400 font-mono text-xs">{dp.numeroDp}</td>
                  <td className="px-6 py-3 text-slate-400">{dp.ville}</td>
                  <td className="px-6 py-3 text-slate-400">{formatDate(dp.dateEnvoi)}</td>
                  <td className={`px-6 py-3 text-sm font-medium ${isOverdue(dp.attenteDP) ? 'text-red-400' : 'text-slate-300'}`}>
                    {formatDate(dp.attenteDP)}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge statut={dp.statut} size="xs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raccordement quick view */}
      <div className="rounded-2xl bg-[#0b1628] border border-white/6 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <p className="text-sm font-semibold text-white">Raccordements — En attente Enedis</p>
          <Link href="/raccordement" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
            Voir tout →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Client</th>
                <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Ville</th>
                <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Dépôt</th>
                <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Statut</th>
                <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {raccordementEnCours.slice(0, 6).map(r => (
                <tr key={r.id} className="border-b border-white/3 table-row-hover transition-colors">
                  <td className="px-6 py-3 font-medium text-white">{r.client}</td>
                  <td className="px-6 py-3 text-slate-400">{r.ville}</td>
                  <td className="px-6 py-3 text-slate-400">{formatDate(r.dateDepot)}</td>
                  <td className="px-6 py-3"><StatusBadge statut={r.statut} size="xs" /></td>
                  <td className="px-6 py-3 text-slate-500 text-xs truncate max-w-[200px]">{r.commentaires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
