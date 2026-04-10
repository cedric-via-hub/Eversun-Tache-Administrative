'use client'
import { useState } from 'react'
import { XCircle, UserPlus, ClipboardPaste, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useData } from '@/lib/DataContext'
import StatusBadge from '@/components/StatusBadge'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'
import EditableCell from '@/components/EditableCell'
import AddRowModal from '@/components/AddRowModal'
import PasteImportModal from '@/components/PasteImportModal'

export default function DPRefusPage() {
  const { dpRefus, updateDPRefus, addDPRefus, importDPRefus, deleteDPRefus } = useData()
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<string|null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showImport, setShowImport] = useState(false)
  function showToast(msg: string) { setToast(msg); setTimeout(()=>setToast(null),3000) }

  const filtered = dpRefus.filter(d=>
    d.client.toLowerCase().includes(search.toLowerCase())||
    d.numeroDp.toLowerCase().includes(search.toLowerCase())||
    d.ville.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      {toast&&<div className="fixed top-4 right-4 z-50 bg-[#0f2040] border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-xl shadow-xl">{toast}</div>}
      <AddRowModal open={showAdd} onClose={()=>setShowAdd(false)} onAdd={d=>{addDPRefus(d);showToast('✅ Dossier ajouté')}} sheetType="dp"/>
      <PasteImportModal open={showImport} onClose={()=>setShowImport(false)} onImport={rows=>{importDPRefus(rows);showToast(`✅ ${rows.length} importés`)}} sheetType="dp"/>

      <PageHeader icon={XCircle} iconColor="text-red-400" title="DP – Refus" subtitle="Déclarations ayant reçu un avis de refus" badge={dpRefus.length}>
        <div className="flex gap-2">
          <button onClick={()=>setShowImport(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-white/4 text-slate-300 border border-white/8 hover:bg-white/8 transition-colors"><ClipboardPaste size={13}/>Coller</button>
          <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"><UserPlus size={13}/>Ajouter</button>
        </div>
      </PageHeader>

      <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4">
        <p className="text-xs text-red-400">Archivés automatiquement quand le statut passe à <span className="font-mono">"Refus"</span> dans DP – En cours.</p>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Client, numéro, ville…" className="w-64"/>

      <div className="rounded-2xl bg-[#0b1628] border border-red-500/10 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b border-white/5 bg-white/2">
            {['Client','Numéro DP','Ville','Prestataire','Financement','Date envoi','Attente DP','Statut',''].map(h=>(
              <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={9}><div className="flex flex-col items-center py-12 gap-2 text-slate-600"><XCircle size={28} className="opacity-20"/><p className="text-sm">Aucun refus.</p></div></td></tr>}
            {filtered.map(dp=>(
              <tr key={dp.id} className="border-b border-white/3 group hover:bg-white/2 transition-colors">
                <td className="px-4 py-2 font-semibold text-white"><EditableCell value={dp.client} onSave={v=>updateDPRefus(dp.id,'client',v)}/></td>
                <td className="px-4 py-2 text-slate-400"><EditableCell value={dp.numeroDp} onSave={v=>updateDPRefus(dp.id,'numeroDp',v)} mono className="text-xs"/></td>
                <td className="px-4 py-2 text-slate-300"><EditableCell value={dp.ville} onSave={v=>updateDPRefus(dp.id,'ville',v)}/></td>
                <td className="px-4 py-2 text-slate-400"><EditableCell value={dp.presta} type="select" options={['Eversun','Dessineo']} onSave={v=>updateDPRefus(dp.id,'presta',v)}/></td>
                <td className="px-4 py-2"><EditableCell value={dp.financement} type="select" options={['SunLib','Otovo','Autre']} onSave={v=>updateDPRefus(dp.id,'financement',v)} renderValue={v=><span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300">{v}</span>}/></td>
                <td className="px-4 py-2 text-slate-400">{formatDate(dp.dateEnvoi)}</td>
                <td className="px-4 py-2 text-slate-400">{formatDate(dp.attenteDP)}</td>
                <td className="px-4 py-2"><StatusBadge statut={dp.statut} size="xs"/></td>
                <td className="px-4 py-2"><button onClick={()=>{if(confirm(`Supprimer ${dp.client} ?`))deleteDPRefus(dp.id)}} className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-400 transition-all"><Trash2 size={13}/></button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
      <p className="text-xs text-slate-700 text-center">💡 Cliquer pour modifier · Survoler pour supprimer</p>
    </div>
  )
}
