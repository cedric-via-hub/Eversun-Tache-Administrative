'use client'
import { useState, useMemo } from 'react'
import { CheckCircle2, FileCheck2, Archive, UserPlus, ClipboardPaste, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useData } from '@/lib/DataContext'
import StatusBadge from '@/components/StatusBadge'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'
import EditableCell from '@/components/EditableCell'
import AddRowModal from '@/components/AddRowModal'
import PasteImportModal from '@/components/PasteImportModal'

export default function DPAccordesPage() {
  const { dpAccordes, updateDPAccordes, addDPAccordes, importDPAccordes, deleteDPAccordes, traiterDAACT } = useData()
  const [search, setSearch] = useState('')
  const [filterDaact, setFilterDaact] = useState<'all'|'archive'|'pending'>('all')
  const [toast, setToast] = useState<string|null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showImport, setShowImport] = useState(false)
  function showToast(msg: string) { setToast(msg); setTimeout(()=>setToast(null),3000) }

  const filtered = useMemo(()=>dpAccordes.filter(d=>{
    const q=search.toLowerCase()
    return (d.client.toLowerCase().includes(q)||d.numeroDp.toLowerCase().includes(q)||d.ville.toLowerCase().includes(q))
      &&(filterDaact==='all'||(filterDaact==='archive'&&d.daact==='Archivé')||(filterDaact==='pending'&&d.daact!=='Archivé'))
  }),[dpAccordes,search,filterDaact])

  const archived = dpAccordes.filter(d=>d.daact==='Archivé').length
  const pending = dpAccordes.filter(d=>d.daact!=='Archivé').length

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      {toast&&<div className="fixed top-4 right-4 z-50 bg-[#0f2040] border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-xl shadow-xl">{toast}</div>}
      <AddRowModal open={showAdd} onClose={()=>setShowAdd(false)} onAdd={d=>{addDPAccordes(d);showToast('✅ Dossier ajouté')}} sheetType="dp"/>
      <PasteImportModal open={showImport} onClose={()=>setShowImport(false)} onImport={rows=>{importDPAccordes(rows);showToast(`✅ ${rows.length} importés`)}} sheetType="dp"/>

      <PageHeader icon={CheckCircle2} iconColor="text-emerald-400" title="DP – Accordés" subtitle="Accordés avec accord favorable" badge={dpAccordes.length}>
        <div className="flex gap-2">
          <button onClick={()=>setShowImport(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-white/4 text-slate-300 border border-white/8 hover:bg-white/8 transition-colors"><ClipboardPaste size={13}/>Coller</button>
          <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"><UserPlus size={13}/>Ajouter</button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-[#0b1628] border border-emerald-500/15 p-4 text-center"><p className="text-2xl font-bold text-emerald-400">{dpAccordes.length}</p><p className="text-xs text-slate-500 mt-1">Total</p></div>
        <div className="rounded-xl bg-[#0b1628] border border-violet-500/15 p-4 text-center"><p className="text-2xl font-bold text-violet-400">{archived}</p><p className="text-xs text-slate-500 mt-1">DAACT archivés</p></div>
        <div className="rounded-xl bg-[#0b1628] border border-amber-500/15 p-4 text-center"><p className="text-2xl font-bold text-amber-400">{pending}</p><p className="text-xs text-slate-500 mt-1">En attente</p></div>
      </div>

      <div className="rounded-xl bg-[#0b1628] border border-violet-500/15 p-4">
        <div className="flex items-center gap-2 mb-2"><Archive size={13} className="text-violet-400"/><p className="text-xs text-violet-400 font-semibold uppercase tracking-widest">Automatisation DAACT</p></div>
        <button onClick={()=>showToast(`✅ ${traiterDAACT()} dossier(s) envoyés`)} className="text-xs px-3 py-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/25 hover:bg-violet-500/20 transition-colors">📝 Envoyer cochés vers DAACT</button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Client, numéro, ville…" className="w-64"/>
        <div className="flex gap-2">
          {[{k:'all',l:`Tous (${dpAccordes.length})`},{k:'archive',l:`Archivé (${archived})`},{k:'pending',l:`Attente (${pending})`}].map(o=>(
            <button key={o.k} onClick={()=>setFilterDaact(o.k as 'all'|'archive'|'pending')} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterDaact===o.k?'bg-emerald-500/10 text-emerald-400 border-emerald-500/30':'text-slate-400 border-white/8'}`}>{o.l}</button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-[#0b1628] border border-white/6 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b border-white/5 bg-white/2">
            {['Client','Numéro DP','Ville','Prestataire','Financement','Date envoi','Statut','DAACT',''].map(h=>(
              <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={9}><div className="flex flex-col items-center py-12 gap-2 text-slate-600"><CheckCircle2 size={28} className="opacity-20"/><p className="text-sm">Aucun dossier accordé.</p><button onClick={()=>setShowAdd(true)} className="text-xs text-emerald-500 hover:text-emerald-400">+ Ajouter</button></div></td></tr>}
            {filtered.map(dp=>(
              <tr key={dp.id} className="border-b border-white/3 group hover:bg-white/2 transition-colors">
                <td className="px-4 py-2 font-semibold text-white"><EditableCell value={dp.client} onSave={v=>updateDPAccordes(dp.id,'client',v)}/></td>
                <td className="px-4 py-2 text-slate-400"><EditableCell value={dp.numeroDp} onSave={v=>updateDPAccordes(dp.id,'numeroDp',v)} mono className="text-xs"/></td>
                <td className="px-4 py-2 text-slate-300"><EditableCell value={dp.ville} onSave={v=>updateDPAccordes(dp.id,'ville',v)}/></td>
                <td className="px-4 py-2 text-slate-400"><EditableCell value={dp.presta} type="select" options={['Eversun','Dessineo']} onSave={v=>updateDPAccordes(dp.id,'presta',v)}/></td>
                <td className="px-4 py-2"><EditableCell value={dp.financement} type="select" options={['SunLib','Otovo','Autre']} onSave={v=>updateDPAccordes(dp.id,'financement',v)} renderValue={v=><span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300">{v}</span>}/></td>
                <td className="px-4 py-2 text-slate-400">{formatDate(dp.dateEnvoi)}</td>
                <td className="px-4 py-2"><StatusBadge statut={dp.statut} size="xs"/></td>
                <td className="px-4 py-2">
                  <EditableCell value={dp.daact==='Archivé'?'Archivé':dp.daact===true?'true':'false'} type="select" options={['false','true','Archivé']}
                    onSave={v=>updateDPAccordes(dp.id,'daact',v==='true'?true:v==='false'?false:v)}
                    renderValue={v=>v==='Archivé'?<span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20"><FileCheck2 size={10}/>Archivé</span>:v==='true'?<span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✓ Coché</span>:<span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/30 text-slate-600 border border-white/4">En attente</span>}/>
                </td>
                <td className="px-4 py-2"><button onClick={()=>{if(confirm(`Supprimer ${dp.client} ?`))deleteDPAccordes(dp.id)}} className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-400 transition-all"><Trash2 size={13}/></button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
      <p className="text-xs text-slate-700 text-center">💡 Cliquer pour modifier · Survoler la ligne pour supprimer</p>
    </div>
  )
}
