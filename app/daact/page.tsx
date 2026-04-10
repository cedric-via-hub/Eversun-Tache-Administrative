'use client'
import { useState, useMemo } from 'react'
import { FileCheck2, UserPlus, ClipboardPaste, Trash2 } from 'lucide-react'
import { useData } from '@/lib/DataContext'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'
import EditableCell from '@/components/EditableCell'
import AddRowModal from '@/components/AddRowModal'
import PasteImportModal from '@/components/PasteImportModal'

export default function DAACTPage() {
  const { daactData, updateDAACT, addDAACT, importDAACT, deleteDAACT } = useData()
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<string|null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showImport, setShowImport] = useState(false)
  function showToast(msg: string) { setToast(msg); setTimeout(()=>setToast(null),3000) }

  const filtered = useMemo(()=>{
    if(!search) return daactData
    const q=search.toLowerCase()
    return daactData.filter(d=>d.client.toLowerCase().includes(q)||d.numeroDp.toLowerCase().includes(q)||d.ville.toLowerCase().includes(q))
  },[daactData,search])

  const done = daactData.filter(d=>d.daact).length

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      {toast&&<div className="fixed top-4 right-4 z-50 bg-[#0f2040] border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-xl shadow-xl">{toast}</div>}
      <AddRowModal open={showAdd} onClose={()=>setShowAdd(false)} onAdd={d=>{addDAACT(d);showToast('✅ DAACT ajouté')}} sheetType="daact"/>
      <PasteImportModal open={showImport} onClose={()=>setShowImport(false)} onImport={rows=>{importDAACT(rows);showToast(`✅ ${rows.length} importés`)}} sheetType="daact"/>

      <PageHeader icon={FileCheck2} iconColor="text-violet-400" title="DAACT" subtitle="Déclarations d'achèvement et de conformité" badge={daactData.length}>
        <div className="flex gap-2">
          <button onClick={()=>setShowImport(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-white/4 text-slate-300 border border-white/8 hover:bg-white/8 transition-colors"><ClipboardPaste size={13}/>Coller</button>
          <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"><UserPlus size={13}/>Ajouter</button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0b1628] border border-violet-500/15 p-5 text-center"><p className="text-3xl font-bold text-violet-400">{done}</p><p className="text-xs text-slate-500 mt-1">Déposées</p></div>
        <div className="rounded-xl bg-[#0b1628] border border-emerald-500/15 p-5 text-center"><p className="text-3xl font-bold text-emerald-400">{daactData.length>0?Math.round(done/daactData.length*100):0}%</p><p className="text-xs text-slate-500 mt-1">Complétion</p></div>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Client, numéro DP, ville…" className="w-64"/>

      <div className="rounded-2xl bg-[#0b1628] border border-white/6 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b border-white/5 bg-white/2">
            {['#','Client','Numéro DP','Ville','DAACT',''].map(h=><th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={6}><div className="flex flex-col items-center py-12 gap-2 text-slate-600"><FileCheck2 size={28} className="opacity-20"/><p className="text-sm">Aucune DAACT.</p><button onClick={()=>setShowAdd(true)} className="text-xs text-emerald-500 hover:text-emerald-400">+ Ajouter</button></div></td></tr>}
            {filtered.map((d,i)=>(
              <tr key={d.id} className="border-b border-white/3 group hover:bg-white/2 transition-colors">
                <td className="px-4 py-2 text-slate-600 text-xs font-mono">{String(i+1).padStart(2,'0')}</td>
                <td className="px-4 py-2 font-semibold text-white"><EditableCell value={d.client} onSave={v=>updateDAACT(d.id,'client',v)}/></td>
                <td className="px-4 py-2 text-slate-400"><EditableCell value={d.numeroDp} onSave={v=>updateDAACT(d.id,'numeroDp',v)} mono className="text-xs"/></td>
                <td className="px-4 py-2 text-slate-300"><EditableCell value={d.ville} onSave={v=>updateDAACT(d.id,'ville',v)}/></td>
                <td className="px-4 py-2">
                  <EditableCell value={d.daact?'true':'false'} type="select" options={['true','false']} onSave={v=>updateDAACT(d.id,'daact',v==='true')}
                    renderValue={v=>v==='true'?<span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium"><FileCheck2 size={10}/>Déposée</span>:<span className="text-xs px-2.5 py-1 rounded-full bg-slate-700/30 text-slate-600 border border-white/4">En attente</span>}/>
                </td>
                <td className="px-4 py-2"><button onClick={()=>{if(confirm(`Supprimer ${d.client} ?`))deleteDAACT(d.id)}} className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-400 transition-all"><Trash2 size={13}/></button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
      <p className="text-xs text-slate-700 text-center">💡 Cliquer pour modifier · Survoler pour supprimer</p>
    </div>
  )
}
