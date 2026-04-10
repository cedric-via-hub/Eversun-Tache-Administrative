'use client'
import { useState, useMemo } from 'react'
import { BadgeCheck, UserPlus, ClipboardPaste, Trash2 } from 'lucide-react'
import { formatDate, isOverdue } from '@/lib/utils'
import { useData } from '@/lib/DataContext'
import StatusBadge from '@/components/StatusBadge'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'
import EditableCell from '@/components/EditableCell'
import AddRowModal from '@/components/AddRowModal'
import PasteImportModal from '@/components/PasteImportModal'

const ETATS=['En attente','Consuel OK','Refusé']
const TYPES=['Bleu','Rouge']
const CAUSES=['Consuel envoyé','Non présent','Autre']

export default function ConsuelPage() {
  const { consuelEnCours, consuelFinalise, updateConsuelEnCours, updateConsuelFinalise, addConsuelEnCours, importConsuelEnCours, deleteConsuelEnCours, archiverConsuels } = useData()
  const [tab, setTab] = useState<'encours'|'finalise'>('encours')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<string|null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showImport, setShowImport] = useState(false)
  function showToast(msg: string) { setToast(msg); setTimeout(()=>setToast(null),3000) }

  const data = tab==='encours'?consuelEnCours:consuelFinalise
  const updater = tab==='encours'?updateConsuelEnCours:updateConsuelFinalise

  const filtered = useMemo(()=>{
    if(!search) return data
    const q=search.toLowerCase()
    return data.filter(d=>d.nom.toLowerCase().includes(q)||d.prenom.toLowerCase().includes(q)||d.contrat.toLowerCase().includes(q))
  },[data,search])

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      {toast&&<div className="fixed top-4 right-4 z-50 bg-[#0f2040] border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-xl shadow-xl">{toast}</div>}
      <AddRowModal open={showAdd} onClose={()=>setShowAdd(false)} onAdd={d=>{addConsuelEnCours(d);showToast('✅ Consuel ajouté')}} sheetType="consuel"/>
      <PasteImportModal open={showImport} onClose={()=>setShowImport(false)} onImport={rows=>{importConsuelEnCours(rows);showToast(`✅ ${rows.length} importés`)}} sheetType="consuel"/>

      <PageHeader icon={BadgeCheck} iconColor="text-cyan-400" title="Consuel" subtitle="Attestations de conformité électrique">
        <div className="flex gap-2">
          <button onClick={()=>setShowImport(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-white/4 text-slate-300 border border-white/8 hover:bg-white/8 transition-colors"><ClipboardPaste size={13}/>Coller</button>
          <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"><UserPlus size={13}/>Ajouter</button>
        </div>
      </PageHeader>

      <div className="rounded-xl bg-[#0b1628] border border-cyan-500/15 p-4">
        <div className="flex items-center gap-2 mb-2"><BadgeCheck size={13} className="text-cyan-400"/><p className="text-xs text-cyan-400 font-semibold uppercase tracking-widest">Automatisation</p></div>
        <button onClick={()=>showToast(`✅ ${archiverConsuels()} archivé(s)`)} className="text-xs px-3 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/20 transition-colors">📁 Archiver les Consuels OK</button>
        <p className="text-[10px] text-slate-600 mt-1">Cause = "Consuel envoyé" ET État = "Consuel OK"</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl bg-[#0b1628] border border-cyan-500/15 p-4 text-center"><p className="text-2xl font-bold text-cyan-400">{consuelEnCours.length}</p><p className="text-xs text-slate-500 mt-1">En cours</p></div>
        <div className="rounded-xl bg-[#0b1628] border border-emerald-500/15 p-4 text-center"><p className="text-2xl font-bold text-emerald-400">{consuelFinalise.length}</p><p className="text-xs text-slate-500 mt-1">Finalisés</p></div>
        <div className="rounded-xl bg-[#0b1628] border border-blue-500/15 p-4 text-center"><p className="text-2xl font-bold text-blue-400">{consuelEnCours.filter(d=>d.typeConsuel==='Bleu').length}</p><p className="text-xs text-slate-500 mt-1">Bleu</p></div>
        <div className="rounded-xl bg-[#0b1628] border border-red-500/15 p-4 text-center"><p className="text-2xl font-bold text-red-400">{consuelEnCours.filter(d=>d.typeConsuel==='Rouge').length}</p><p className="text-xs text-slate-500 mt-1">Rouge</p></div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {(['encours','finalise'] as const).map(k=>(
            <button key={k} onClick={()=>setTab(k)} className={`text-sm px-4 py-2 rounded-xl border transition-colors ${tab===k?'bg-cyan-500/10 text-cyan-400 border-cyan-500/30':'text-slate-400 border-white/8'}`}>{k==='encours'?`En cours (${consuelEnCours.length})`:`Finalisés (${consuelFinalise.length})`}</button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Nom, prénom, contrat…" className="w-64"/>
      </div>

      <div className="rounded-2xl bg-[#0b1628] border border-white/6 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b border-white/5 bg-white/2">
            {['Nom','Contrat','Presta','Type','Cause','MES','Dernière démarche','Date est.','État','Client inf.','Commentaire',''].map(h=>(
              <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={12}><div className="flex flex-col items-center py-12 gap-2 text-slate-600"><BadgeCheck size={28} className="opacity-20"/><p className="text-sm">Aucun consuel.</p><button onClick={()=>setShowAdd(true)} className="text-xs text-emerald-500 hover:text-emerald-400">+ Ajouter</button></div></td></tr>}
            {filtered.map(c=>(
              <tr key={c.id} className="border-b border-white/3 group hover:bg-white/2 transition-colors">
                <td className="px-4 py-2 font-semibold text-white whitespace-nowrap"><EditableCell value={c.nom} onSave={v=>updater(c.id,'nom',v)}/><span className="text-slate-400 font-normal text-xs ml-1">{c.prenom}</span></td>
                <td className="px-4 py-2"><EditableCell value={c.contrat} onSave={v=>updater(c.id,'contrat',v)} mono className="text-xs text-slate-400"/></td>
                <td className="px-4 py-2 text-slate-400"><EditableCell value={c.prestataire} type="select" options={['Eversun','Dessineo']} onSave={v=>updater(c.id,'prestataire',v)}/></td>
                <td className="px-4 py-2"><EditableCell value={c.typeConsuel} type="select" options={TYPES} onSave={v=>updater(c.id,'typeConsuel',v)} renderValue={v=><span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${v==='Bleu'?'bg-blue-500/10 text-blue-400 border-blue-500/20':'bg-red-500/10 text-red-400 border-red-500/20'}`}>{v}</span>}/></td>
                <td className="px-4 py-2 text-slate-400"><EditableCell value={c.causeAbsence} type="select" options={CAUSES} onSave={v=>updater(c.id,'causeAbsence',v)} className="text-xs"/></td>
                <td className="px-4 py-2 text-slate-400">{formatDate(c.dateMES)}</td>
                <td className={`px-4 py-2 ${isOverdue(c.dateDerniereDemarche)?'text-red-400':'text-slate-400'}`}>{formatDate(c.dateDerniereDemarche)}</td>
                <td className="px-4 py-2 text-slate-300">{formatDate(c.dateEstimative)}</td>
                <td className="px-4 py-2"><EditableCell value={c.etat} type="select" options={ETATS} onSave={v=>updater(c.id,'etat',v)} renderValue={v=><StatusBadge statut={v} size="xs"/>}/></td>
                <td className="px-4 py-2"><EditableCell value={c.clientInforme?'true':'false'} type="select" options={['true','false']} onSave={v=>updater(c.id,'clientInforme',v==='true')} renderValue={v=>v==='true'?<span className="text-xs text-emerald-400">✓ Oui</span>:<span className="text-xs text-slate-600">Non</span>}/></td>
                <td className="px-4 py-2 text-slate-500 text-xs"><EditableCell value={c.commentaires} onSave={v=>updater(c.id,'commentaires',v)} className="max-w-[160px] truncate"/></td>
                <td className="px-4 py-2">{tab==='encours'&&<button onClick={()=>{if(confirm(`Supprimer ${c.nom} ?`))deleteConsuelEnCours(c.id)}} className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-400 transition-all"><Trash2 size={13}/></button>}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
      <p className="text-xs text-slate-700 text-center">💡 Cliquer pour modifier · Survoler pour supprimer</p>
    </div>
  )
}
