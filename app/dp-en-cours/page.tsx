'use client'

import { useState, useMemo } from 'react'
import { ClipboardList, Clock, AlertTriangle, Zap, CheckCircle2, XCircle, RefreshCw, UserPlus, ClipboardPaste, Trash2 } from 'lucide-react'
import { formatDate, isOverdue, daysUntil, computeAttenteDP, excelToDate } from '@/lib/utils'
import { useData } from '@/lib/DataContext'
import StatusBadge from '@/components/StatusBadge'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'
import EditableCell from '@/components/EditableCell'
import AddRowModal from '@/components/AddRowModal'
import PasteImportModal from '@/components/PasteImportModal'

const STATUTS = ["En cours d'instruction",'Accord favorable','Refus','ABF','ABF favorable','En attente']

function dateInputToSerial(s: string): number | null {
  if (!s) return null
  return Math.round(new Date(s).getTime() / 86400000 + 25569)
}
function serialToDateInput(serial: number | null | undefined): string {
  if (!serial) return ''
  const d = excelToDate(serial)
  return d ? d.toISOString().split('T')[0] : ''
}

export default function DPEnCoursPage() {
  const { dpEnCours, updateDPEnCours, addDPEnCours, importDPEnCours, deleteDPEnCours, archiverAccords, archiverRefus } = useData()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showImport, setShowImport] = useState(false)

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  function handleRecalcAll() {
    dpEnCours.forEach(dp => {
      if (dp.dateEnvoi) {
        const computed = computeAttenteDP(dp.dateEnvoi, dp.statut)
        if (computed) updateDPEnCours(dp.id, 'attenteDP', Math.round(computed.getTime() / 86400000 + 25569))
      }
    })
    showToast('🔄 Dates Attente DP recalculées')
  }

  const statuts = [...new Set(dpEnCours.map(d => d.statut))]
  const filtered = useMemo(() => dpEnCours.filter(d => {
    const q = search.toLowerCase()
    return (d.client.toLowerCase().includes(q) || d.numeroDp.toLowerCase().includes(q) || d.ville.toLowerCase().includes(q))
      && (filter === 'all' || d.statut === filter)
  }), [dpEnCours, search, filter])

  const overdue = filtered.filter(d => isOverdue(d.attenteDP))

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      {toast && <div className="fixed top-4 right-4 z-50 bg-[#0f2040] border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-xl shadow-xl animate-slide-up">{toast}</div>}
      <AddRowModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={data => { addDPEnCours(data); showToast('✅ Dossier ajouté') }} sheetType="dp" />
      <PasteImportModal open={showImport} onClose={() => setShowImport(false)} onImport={rows => { importDPEnCours(rows); showToast(`✅ ${rows.length} dossier(s) importés`) }} sheetType="dp" />

      <PageHeader icon={ClipboardList} iconColor="text-blue-400" title="DP – En cours"
        subtitle="Déclarations préalables en cours d'instruction" badge={filtered.length}>
        <div className="flex gap-2">
          <button onClick={() => setShowImport(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-white/4 text-slate-300 border border-white/8 hover:bg-white/8 hover:text-white transition-colors">
            <ClipboardPaste size={13} /> Coller depuis Excel
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors">
            <UserPlus size={13} /> Ajouter un dossier
          </button>
        </div>
      </PageHeader>

      {/* Automations */}
      <div className="rounded-xl bg-[#0b1628] border border-white/6 p-4">
        <div className="flex items-center gap-2 mb-3"><Zap size={13} className="text-emerald-400" /><p className="text-xs text-emerald-400 font-semibold uppercase tracking-widest">Automatisations Apps Script</p></div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => showToast(`${archiverAccords() || 'Aucun'} accord(s) archivé(s)`)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 transition-colors"><CheckCircle2 size={12} /> Archiver Accords</button>
          <button onClick={() => showToast(`${archiverRefus() || 'Aucun'} refus archivé(s)`)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 transition-colors"><XCircle size={12} /> Archiver Refus</button>
          <button onClick={handleRecalcAll} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/25 hover:bg-blue-500/20 transition-colors"><RefreshCw size={12} /> Recalculer dates</button>
        </div>
        <p className="text-[10px] text-slate-600 mt-2">Délai auto : +2 mois si ABF, +1 mois sinon. Cliquer sur une cellule pour modifier.</p>
      </div>

      {overdue.length > 0 && (
        <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-3 flex items-center gap-2">
          <AlertTriangle size={13} className="text-red-400 shrink-0" />
          <p className="text-xs text-red-400"><span className="font-semibold">{overdue.length} dossier(s)</span> en retard.</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-[#0b1628] border border-white/6 p-4 text-center"><p className="text-2xl font-bold text-white">{filtered.length}</p><p className="text-xs text-slate-500 mt-1">Total</p></div>
        <div className="rounded-xl bg-[#0b1628] border border-amber-500/15 p-4 text-center"><p className="text-2xl font-bold text-amber-400">{filtered.filter(d => d.statut.toUpperCase().includes('ABF')).length}</p><p className="text-xs text-slate-500 mt-1">ABF</p></div>
        <div className="rounded-xl bg-[#0b1628] border border-red-500/15 p-4 text-center"><p className="text-2xl font-bold text-red-400">{overdue.length}</p><p className="text-xs text-slate-500 mt-1">En retard</p></div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Client, numéro DP, ville…" className="w-64" />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter('all')} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === 'all' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'text-slate-400 border-white/8'}`}>Tous ({dpEnCours.length})</button>
          {statuts.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === s ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'text-slate-400 border-white/8'}`}>
              {s} ({dpEnCours.filter(d => d.statut === s).length})
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-[#0b1628] border border-white/6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                {['Client','Numéro DP','Ville','Presta','Financement','Date envoi','Attente DP','Statut','Portail',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium whitespace-nowrap">{h === 'Attente DP' ? <span className="flex items-center gap-1"><Clock size={10}/>{h}</span> : h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={10}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-600">
                    <ClipboardList size={32} className="opacity-20" />
                    <p className="text-sm">Aucun dossier. Ajoutez-en un ou importez depuis Excel.</p>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => setShowImport(true)} className="text-xs px-3 py-1.5 rounded-lg bg-white/4 text-slate-400 border border-white/8 hover:text-white transition-colors"><ClipboardPaste size={11} className="inline mr-1"/>Coller depuis Excel</button>
                      <button onClick={() => setShowAdd(true)} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 transition-colors"><UserPlus size={11} className="inline mr-1"/>Nouveau dossier</button>
                    </div>
                  </div>
                </td></tr>
              )}
              {filtered.map(dp => {
                const over = isOverdue(dp.attenteDP)
                const days = daysUntil(dp.attenteDP)
                const computed = computeAttenteDP(dp.dateEnvoi, dp.statut)
                return (
                  <tr key={dp.id} className={`border-b border-white/3 group transition-colors ${over ? 'bg-red-950/10' : 'hover:bg-white/2'}`}>
                    <td className="px-4 py-2 font-semibold text-white"><EditableCell value={dp.client} onSave={v => updateDPEnCours(dp.id,'client',v)} /></td>
                    <td className="px-4 py-2 text-slate-400"><EditableCell value={dp.numeroDp} onSave={v => updateDPEnCours(dp.id,'numeroDp',v)} mono className="text-xs" /></td>
                    <td className="px-4 py-2 text-slate-300"><EditableCell value={dp.ville} onSave={v => updateDPEnCours(dp.id,'ville',v)} /></td>
                    <td className="px-4 py-2 text-slate-400"><EditableCell value={dp.presta} type="select" options={['Eversun','Dessineo']} onSave={v => updateDPEnCours(dp.id,'presta',v)} /></td>
                    <td className="px-4 py-2"><EditableCell value={dp.financement} type="select" options={['SunLib','Otovo','Autre']} onSave={v => updateDPEnCours(dp.id,'financement',v)} renderValue={v=><span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300">{v}</span>} /></td>
                    <td className="px-4 py-2 text-slate-400"><EditableCell value={serialToDateInput(dp.dateEnvoi??undefined)} type="date" onSave={v=>updateDPEnCours(dp.id,'dateEnvoi',dateInputToSerial(v))} renderValue={()=><span>{formatDate(dp.dateEnvoi)}</span>} /></td>
                    <td className="px-4 py-2">
                      <EditableCell value={serialToDateInput(dp.attenteDP??undefined)} type="date" onSave={v=>updateDPEnCours(dp.id,'attenteDP',dateInputToSerial(v))}
                        renderValue={()=>(
                          <div className="flex flex-col gap-0.5">
                            <span className={`text-sm font-medium ${over?'text-red-400':'text-slate-300'}`}>{formatDate(dp.attenteDP)}</span>
                            {computed && !dp.attenteDP && <span className="text-[10px] text-blue-500">auto: {computed.toLocaleDateString('fr-FR')}</span>}
                            {days!==null&&<span className={`text-[10px] ${over?'text-red-500':days<7?'text-amber-500':'text-slate-600'}`}>{over?`${Math.abs(days)}j retard`:`dans ${days}j`}</span>}
                          </div>
                        )} />
                    </td>
                    <td className="px-4 py-2"><EditableCell value={dp.statut} type="select" options={STATUTS} onSave={v=>updateDPEnCours(dp.id,'statut',v)} renderValue={v=><StatusBadge statut={v} size="xs"/>} /></td>
                    <td className="px-4 py-2"><EditableCell value={dp.siteDp??''} onSave={v=>updateDPEnCours(dp.id,'siteDp',v)} renderValue={v=>v&&v!=='—'?(<a href={v.startsWith('http')?v:`https://${v}`} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} className="text-xs text-emerald-400 hover:text-emerald-300 underline">Portail ↗</a>):<span className="text-slate-700 text-xs">+</span>} /></td>
                    <td className="px-4 py-2">
                      <button onClick={()=>{if(confirm(`Supprimer ${dp.client} ?`)) deleteDPEnCours(dp.id)}} className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-400 transition-all"><Trash2 size={13}/></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-slate-700 text-center">💡 Cliquer sur une cellule pour modifier · Entrée pour valider · Échap pour annuler · Survoler pour supprimer</p>
    </div>
  )
}
