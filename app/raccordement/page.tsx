'use client'
import { useState, useMemo } from 'react'
import { Zap, UserPlus, ClipboardPaste, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useData } from '@/lib/DataContext'
import StatusBadge from '@/components/StatusBadge'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'
import EditableCell from '@/components/EditableCell'
import AddRowModal from '@/components/AddRowModal'
import PasteImportModal from '@/components/PasteImportModal'

const STATUTS_RAC=['En attente Enedis','Consuel OK','Raccordé','Mise en service']

export default function RaccordementPage() {
  const { raccordementEnCours, raccordementMES, updateRaccordementEnCours, updateRaccordementMES, addRaccordementEnCours, importRaccordementEnCours, deleteRaccordementEnCours, archiverRaccordementMES } = useData()
  const [tab, setTab] = useState<'encours'|'mes'>('encours')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<string|null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showImport, setShowImport] = useState(false)
  function showToast(msg: string) { setToast(msg); setTimeout(()=>setToast(null),3000) }

  const data = tab==='encours'?raccordementEnCours:raccordementMES
  const updater = tab==='encours'?updateRaccordementEnCours:updateRaccordementMES

  const filtered = useMemo(()=>{
    if(!search) return data
    const q=search.toLowerCase()
    return data.filter(d=>d.client.toLowerCase().includes(q)||d.ville.toLowerCase().includes(q)||d.numeroDp.toLowerCase().includes(q))
  },[data,search])

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      {toast&&<div className="fixed top-4 right-4 z-50 bg-[#0f2040] border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-xl shadow-xl">{toast}</div>}
      <AddRowModal open={showAdd} onClose={()=>setShowAdd(false)} onAdd={d=>{addRaccordementEnCours(d);showToast('✅ Raccordement ajouté')}} sheetType="raccordement"/>
      <PasteImportModal open={showImport} onClose={()=>setShowImport(false)} onImport={rows=>{importRaccordementEnCours(rows);showToast(`✅ ${rows.length} importés`)}} sheetType="raccordement"/>

      <PageHeader icon={Zap} iconColor="text-amber-400" title="Raccordement" subtitle="Raccordements réseau et mises en service">
        <div className="flex gap-2">
          <button onClick={()=>setShowImport(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-white/4 text-slate-300 border border-white/8 hover:bg-white/8 transition-colors"><ClipboardPaste size={13}/>Coller</button>
          <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"><UserPlus size={13}/>Ajouter</button>
        </div>
      </PageHeader>

      <div className="rounded-xl bg-[#0b1628] border border-amber-500/15 p-4">
        <div className="flex items-center gap-2 mb-2"><Zap size={13} className="text-amber-400"/><p className="text-xs text-amber-400 font-semibold uppercase tracking-widest">Automatisation</p></div>
        <button onClick={()=>showToast(`✅ ${archiverRaccordementMES()} déplacé(s) vers MES`)} className="text-xs px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition-colors">🚀 Archiver "Mise en service"</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {v:raccordementEnCours.filter(d=>d.statut==='En attente Enedis').length,l:'Att. Enedis',c:'amber'},
          {v:raccordementEnCours.filter(d=>d.statut==='Consuel OK').length,l:'Consuel OK',c:'cyan'},
          {v:raccordementEnCours.filter(d=>d.statut==='Raccordé').length,l:'Raccordé',c:'teal'},
          {v:raccordementMES.length,l:'MES',c:'violet'},
        ].map(s=>(
          <div key={s.l} className={`rounded-xl bg-[#0b1628] border border-${s.c}-500/15 p-4 text-center`}>
            <p className={`text-2xl font-bold text-${s.c}-400`}>{s.v}</p><p className="text-xs text-slate-500 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {(['encours','mes'] as const).map(k=>(
            <button key={k} onClick={()=>setTab(k)} className={`text-sm px-4 py-2 rounded-xl border transition-colors ${tab===k?'bg-amber-500/10 text-amber-400 border-amber-500/30':'text-slate-400 border-white/8'}`}>{k==='encours'?`En cours (${raccordementEnCours.length})`:`MES (${raccordementMES.length})`}</button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Client, ville, numéro DP…" className="w-64"/>
      </div>

      <div className="rounded-2xl bg-[#0b1628] border border-white/6 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b border-white/5 bg-white/2">
            {['Client','Numéro DP','Ville','Presta','Financement','Dépôt','Statut','Commentaire',''].map(h=>(
              <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={9}><div className="flex flex-col items-center py-12 gap-2 text-slate-600"><Zap size={28} className="opacity-20"/><p className="text-sm">Aucun raccordement.</p><button onClick={()=>setShowAdd(true)} className="text-xs text-emerald-500 hover:text-emerald-400">+ Ajouter</button></div></td></tr>}
            {filtered.map(r=>(
              <tr key={r.id} className="border-b border-white/3 group hover:bg-white/2 transition-colors">
                <td className="px-4 py-2 font-semibold text-white"><EditableCell value={r.client} onSave={v=>updater(r.id,'client',v)}/></td>
                <td className="px-4 py-2 text-slate-400"><EditableCell value={r.numeroDp} onSave={v=>updater(r.id,'numeroDp',v)} mono className="text-xs"/></td>
                <td className="px-4 py-2 text-slate-300"><EditableCell value={r.ville} onSave={v=>updater(r.id,'ville',v)}/></td>
                <td className="px-4 py-2 text-slate-400"><EditableCell value={r.presta} type="select" options={['Eversun','Dessineo']} onSave={v=>updater(r.id,'presta',v)}/></td>
                <td className="px-4 py-2"><EditableCell value={r.financement} type="select" options={['SunLib','Otovo','Autre']} onSave={v=>updater(r.id,'financement',v)} renderValue={v=><span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300">{v}</span>}/></td>
                <td className="px-4 py-2 text-slate-400">{formatDate(r.dateDepot)}</td>
                <td className="px-4 py-2">{tab==='encours'?<EditableCell value={r.statut} type="select" options={STATUTS_RAC} onSave={v=>updater(r.id,'statut',v)} renderValue={v=><StatusBadge statut={v} size="xs"/>}/>:<StatusBadge statut={r.statut} size="xs"/>}</td>
                <td className="px-4 py-2 text-slate-500 text-xs"><EditableCell value={r.commentaires??''} onSave={v=>updater(r.id,'commentaires',v)} className="max-w-[180px] truncate"/></td>
                <td className="px-4 py-2">{tab==='encours'&&<button onClick={()=>{if(confirm(`Supprimer ${r.client} ?`))deleteRaccordementEnCours(r.id)}} className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-400 transition-all"><Trash2 size={13}/></button>}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
      <p className="text-xs text-slate-700 text-center">💡 Cliquer pour modifier · Survoler pour supprimer</p>
    </div>
  )
}
