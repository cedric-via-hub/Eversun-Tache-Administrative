'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import {
  dpEnCours as init_dpEnCours,
  dpAccordes as init_dpAccordes,
  dpRefus as init_dpRefus,
  consuelEnCours as init_consuelEnCours,
  consuelFinalise as init_consuelFinalise,
  raccordementEnCours as init_raccordementEnCours,
  raccordementMES as init_raccordementMES,
  daactData as init_daactData,
  DossierDP, DossierConsuel, DossierRaccordement, DossierDAACT,
} from '@/data/mockData'
import { computeAttenteDP } from '@/lib/utils'

// ── helpers ──────────────────────────────────────────────────

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }

function dateStrToSerial(s: string): number | null {
  if (!s) return null
  const d = new Date(s)
  if (isNaN(d.getTime())) return null
  return Math.round(d.getTime() / 86400000 + 25569)
}

function updateItem<T extends { id: string }>(arr: T[], id: string, field: keyof T, value: unknown): T[] {
  return arr.map(item => {
    if (item.id !== id) return item
    const updated = { ...item, [field]: value }
    if ((field === 'dateEnvoi' || field === 'statut') && 'attenteDP' in updated) {
      const dp = updated as unknown as DossierDP
      const computed = computeAttenteDP(dp.dateEnvoi, dp.statut)
      if (computed) return { ...updated, attenteDP: Math.round(computed.getTime() / 86400000 + 25569) } as T
    }
    return updated
  })
}

// ── parse paste rows → typed objects ─────────────────────────

export function parsePasteRowsToDP(rows: Record<string, string>[]): DossierDP[] {
  return rows.map(r => {
    const dateEnvoi = dateStrToSerial(r["Date d'envoi DP"] || r['col_1'] || '')
    const statut = r['Statut'] || r['col_5'] || "En cours d'instruction"
    const attenteDP = (() => {
      const s = dateStrToSerial(r['Attente DP'] || r['col_2'] || '')
      if (s) return s
      if (!dateEnvoi) return null
      const d = new Date((dateEnvoi - 25569) * 86400000)
      d.setMonth(d.getMonth() + (statut.toUpperCase().includes('ABF') ? 2 : 1))
      return Math.round(d.getTime() / 86400000 + 25569)
    })()
    return {
      id: uid(),
      client: r['Client'] || r['col_0'] || '',
      dateEnvoi,
      attenteDP,
      presta: r['Presta'] || r['col_3'] || 'Eversun',
      financement: r['Financement'] || r['col_4'] || 'SunLib',
      statut,
      numeroDp: r['Numéro DP'] || r['col_6'] || '',
      ville: r['Ville'] || r['col_7'] || '',
      siteDp: r['Site DP'] || r['col_8'] || '',
      email: r['Email'] || r['col_9'] || '',
      daact: false,
    }
  }).filter(d => d.client)
}

export function parsePasteRowsToConsuel(rows: Record<string, string>[]): DossierConsuel[] {
  return rows.map(r => ({
    id: uid(),
    nom: r['Nom'] || r['col_0'] || '',
    prenom: r['Prénom'] || r['col_1'] || '',
    contrat: r['Contrat abonné'] || r['col_2'] || '',
    dateSignature: dateStrToSerial(r['Date signature'] || r['col_3'] || ''),
    dateMES: dateStrToSerial(r['Date MES'] || r['col_4'] || ''),
    causeAbsence: r['Cause absence'] || r['col_5'] || 'Consuel envoyé',
    prestataire: r['Prestataire'] || r['col_6'] || 'Eversun',
    etat: r['État'] || r['col_7'] || 'En attente',
    typeConsuel: r['Type Consuel'] || r['col_8'] || 'Bleu',
    dateDerniereDemarche: dateStrToSerial(r['Date dernière démarche'] || r['col_9'] || ''),
    commentaires: r['Commentaires'] || r['col_10'] || '',
    dateEstimative: dateStrToSerial(r['Date estimative'] || r['col_11'] || ''),
    clientInforme: (r['Client informé'] || r['col_12'] || '').toLowerCase() === 'true' || (r['Client informé'] || '') === '1',
    mes: (r['MES'] || r['col_13'] || '').toLowerCase() === 'true',
  })).filter(d => d.nom)
}

export function parsePasteRowsToRaccordement(rows: Record<string, string>[]): DossierRaccordement[] {
  return rows.map(r => ({
    id: uid(),
    client: r['Client'] || r['col_0'] || '',
    numeroDp: r['Numéro DP'] || r['col_1'] || '',
    ville: r['Ville'] || r['col_2'] || '',
    presta: r['Presta'] || r['col_3'] || 'Eversun',
    financement: r['Financement'] || r['col_4'] || 'SunLib',
    dateDepot: dateStrToSerial(r['Date dépôt'] || r['col_5'] || ''),
    statut: r['Statut'] || r['col_6'] || 'En attente Enedis',
    commentaires: r['Commentaires'] || r['col_7'] || '',
  })).filter(d => d.client)
}

export function parsePasteRowsToDAACT(rows: Record<string, string>[]): DossierDAACT[] {
  return rows.map(r => ({
    id: uid(),
    client: r['Client'] || r['col_0'] || '',
    numeroDp: r['Numéro DP'] || r['col_1'] || '',
    ville: r['Ville'] || r['col_2'] || '',
    daact: (r['DAACT'] || r['col_3'] || '').toLowerCase() === 'true',
  })).filter(d => d.client)
}

// ── context type ──────────────────────────────────────────────

interface DataStore {
  dpEnCours: DossierDP[]; dpAccordes: DossierDP[]; dpRefus: DossierDP[]
  consuelEnCours: DossierConsuel[]; consuelFinalise: DossierConsuel[]
  raccordementEnCours: DossierRaccordement[]; raccordementMES: DossierRaccordement[]
  daactData: DossierDAACT[]
  // Updates
  updateDPEnCours: (id: string, f: keyof DossierDP, v: unknown) => void
  updateDPAccordes: (id: string, f: keyof DossierDP, v: unknown) => void
  updateDPRefus: (id: string, f: keyof DossierDP, v: unknown) => void
  updateConsuelEnCours: (id: string, f: keyof DossierConsuel, v: unknown) => void
  updateConsuelFinalise: (id: string, f: keyof DossierConsuel, v: unknown) => void
  updateRaccordementEnCours: (id: string, f: keyof DossierRaccordement, v: unknown) => void
  updateRaccordementMES: (id: string, f: keyof DossierRaccordement, v: unknown) => void
  updateDAACT: (id: string, f: keyof DossierDAACT, v: unknown) => void
  // Add
  addDPEnCours: (data: Record<string, string>) => void
  addDPAccordes: (data: Record<string, string>) => void
  addDPRefus: (data: Record<string, string>) => void
  addConsuelEnCours: (data: Record<string, string>) => void
  addRaccordementEnCours: (data: Record<string, string>) => void
  addDAACT: (data: Record<string, string>) => void
  // Import (paste)
  importDPEnCours: (rows: Record<string, string>[]) => void
  importDPAccordes: (rows: Record<string, string>[]) => void
  importDPRefus: (rows: Record<string, string>[]) => void
  importConsuelEnCours: (rows: Record<string, string>[]) => void
  importRaccordementEnCours: (rows: Record<string, string>[]) => void
  importDAACT: (rows: Record<string, string>[]) => void
  // Delete
  deleteDPEnCours: (id: string) => void
  deleteDPAccordes: (id: string) => void
  deleteDPRefus: (id: string) => void
  deleteConsuelEnCours: (id: string) => void
  deleteRaccordementEnCours: (id: string) => void
  deleteDAACT: (id: string) => void
  // Clear all
  clearAll: () => void
  // Automations
  archiverAccords: () => number
  archiverRefus: () => number
  archiverRaccordementMES: () => number
  archiverConsuels: () => number
  traiterDAACT: () => number
}

const DataContext = createContext<DataStore | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [dpEnCours, setDP] = useState<DossierDP[]>(init_dpEnCours)
  const [dpAccordes, setDPAcc] = useState<DossierDP[]>(init_dpAccordes)
  const [dpRefus, setDPRef] = useState<DossierDP[]>(init_dpRefus)
  const [consuelEnCours, setCons] = useState<DossierConsuel[]>(init_consuelEnCours)
  const [consuelFinalise, setConsFin] = useState<DossierConsuel[]>(init_consuelFinalise)
  const [raccordementEnCours, setRac] = useState<DossierRaccordement[]>(init_raccordementEnCours)
  const [raccordementMES, setRacMES] = useState<DossierRaccordement[]>(init_raccordementMES)
  const [daactData, setDAACT] = useState<DossierDAACT[]>(init_daactData)

  // ── Updates ──
  const updateDPEnCours = useCallback((id: string, f: keyof DossierDP, v: unknown) => setDP(p => updateItem(p, id, f, v)), [])
  const updateDPAccordes = useCallback((id: string, f: keyof DossierDP, v: unknown) => setDPAcc(p => updateItem(p, id, f, v)), [])
  const updateDPRefus = useCallback((id: string, f: keyof DossierDP, v: unknown) => setDPRef(p => updateItem(p, id, f, v)), [])
  const updateConsuelEnCours = useCallback((id: string, f: keyof DossierConsuel, v: unknown) => setCons(p => updateItem(p, id, f, v)), [])
  const updateConsuelFinalise = useCallback((id: string, f: keyof DossierConsuel, v: unknown) => setConsFin(p => updateItem(p, id, f, v)), [])
  const updateRaccordementEnCours = useCallback((id: string, f: keyof DossierRaccordement, v: unknown) => setRac(p => updateItem(p, id, f, v)), [])
  const updateRaccordementMES = useCallback((id: string, f: keyof DossierRaccordement, v: unknown) => setRacMES(p => updateItem(p, id, f, v)), [])
  const updateDAACT = useCallback((id: string, f: keyof DossierDAACT, v: unknown) => setDAACT(p => updateItem(p, id, f, v)), [])

  // ── Add single row ──
  function makeDP(data: Record<string, string>): DossierDP {
    const dateEnvoi = dateStrToSerial(data.dateEnvoi || '')
    const statut = data.statut || "En cours d'instruction"
    const computed = dateEnvoi ? computeAttenteDP(dateEnvoi, statut) : null
    return {
      id: uid(), client: data.client || '', dateEnvoi,
      attenteDP: computed ? Math.round(computed.getTime() / 86400000 + 25569) : null,
      presta: data.presta || 'Eversun', financement: data.financement || 'SunLib',
      statut, numeroDp: data.numeroDp || '', ville: data.ville || '',
      siteDp: data.siteDp || '', email: data.email || '', daact: false,
    }
  }

  const addDPEnCours = useCallback((data: Record<string, string>) => setDP(p => [...p, makeDP(data)]), [])
  const addDPAccordes = useCallback((data: Record<string, string>) => setDPAcc(p => [...p, makeDP(data)]), [])
  const addDPRefus = useCallback((data: Record<string, string>) => setDPRef(p => [...p, makeDP(data)]), [])
  const addConsuelEnCours = useCallback((data: Record<string, string>) => setCons(p => [...p, {
    id: uid(), nom: data.nom || '', prenom: data.prenom || '',
    contrat: data.contrat || '', dateSignature: dateStrToSerial(data.dateSignature || ''),
    dateMES: dateStrToSerial(data.dateMES || ''), causeAbsence: data.causeAbsence || 'Consuel envoyé',
    prestataire: data.prestataire || 'Eversun', etat: data.etat || 'En attente',
    typeConsuel: data.typeConsuel || 'Bleu',
    dateDerniereDemarche: dateStrToSerial(data.dateDerniereDemarche || ''),
    commentaires: data.commentaires || '',
    dateEstimative: dateStrToSerial(data.dateEstimative || ''),
    clientInforme: false, mes: false,
  }]), [])
  const addRaccordementEnCours = useCallback((data: Record<string, string>) => setRac(p => [...p, {
    id: uid(), client: data.client || '', numeroDp: data.numeroDp || '',
    ville: data.ville || '', presta: data.presta || 'Eversun',
    financement: data.financement || 'SunLib', dateDepot: dateStrToSerial(data.dateDepot || ''),
    statut: data.statut || 'En attente Enedis', commentaires: data.commentaires || '',
  }]), [])
  const addDAACT = useCallback((data: Record<string, string>) => setDAACT(p => [...p, {
    id: uid(), client: data.client || '', numeroDp: data.numeroDp || '',
    ville: data.ville || '', daact: false,
  }]), [])

  // ── Import (paste) ──
  const importDPEnCours = useCallback((rows: Record<string, string>[]) => setDP(p => [...p, ...parsePasteRowsToDP(rows)]), [])
  const importDPAccordes = useCallback((rows: Record<string, string>[]) => setDPAcc(p => [...p, ...parsePasteRowsToDP(rows)]), [])
  const importDPRefus = useCallback((rows: Record<string, string>[]) => setDPRef(p => [...p, ...parsePasteRowsToDP(rows)]), [])
  const importConsuelEnCours = useCallback((rows: Record<string, string>[]) => setCons(p => [...p, ...parsePasteRowsToConsuel(rows)]), [])
  const importRaccordementEnCours = useCallback((rows: Record<string, string>[]) => setRac(p => [...p, ...parsePasteRowsToRaccordement(rows)]), [])
  const importDAACT = useCallback((rows: Record<string, string>[]) => setDAACT(p => [...p, ...parsePasteRowsToDAACT(rows)]), [])

  // ── Delete ──
  const deleteDPEnCours = useCallback((id: string) => setDP(p => p.filter(x => x.id !== id)), [])
  const deleteDPAccordes = useCallback((id: string) => setDPAcc(p => p.filter(x => x.id !== id)), [])
  const deleteDPRefus = useCallback((id: string) => setDPRef(p => p.filter(x => x.id !== id)), [])
  const deleteConsuelEnCours = useCallback((id: string) => setCons(p => p.filter(x => x.id !== id)), [])
  const deleteRaccordementEnCours = useCallback((id: string) => setRac(p => p.filter(x => x.id !== id)), [])
  const deleteDAACT = useCallback((id: string) => setDAACT(p => p.filter(x => x.id !== id)), [])

  // ── Clear all ──
  const clearAll = useCallback(() => {
    setDP([]); setDPAcc([]); setDPRef([])
    setCons([]); setConsFin([])
    setRac([]); setRacMES([])
    setDAACT([])
  }, [])

  // ── Automations ──
  const archiverAccords = useCallback(() => {
    const toMove = dpEnCours.filter(d => d.statut === 'Accord favorable')
    if (!toMove.length) return 0
    setDPAcc(p => [...p, ...toMove])
    setDP(p => p.filter(d => d.statut !== 'Accord favorable'))
    return toMove.length
  }, [dpEnCours])

  const archiverRefus = useCallback(() => {
    const toMove = dpEnCours.filter(d => d.statut === 'Refus')
    if (!toMove.length) return 0
    setDPRef(p => [...p, ...toMove])
    setDP(p => p.filter(d => d.statut !== 'Refus'))
    return toMove.length
  }, [dpEnCours])

  const archiverRaccordementMES = useCallback(() => {
    const toMove = raccordementEnCours.filter(d => d.statut === 'Mise en service')
    if (!toMove.length) return 0
    setRacMES(p => [...p, ...toMove])
    setRac(p => p.filter(d => d.statut !== 'Mise en service'))
    return toMove.length
  }, [raccordementEnCours])

  const archiverConsuels = useCallback(() => {
    const toMove = consuelEnCours.filter(d => d.causeAbsence === 'Consuel envoyé' && d.etat === 'Consuel OK')
    if (!toMove.length) return 0
    setConsFin(p => [...p, ...toMove])
    setCons(p => p.filter(d => !(d.causeAbsence === 'Consuel envoyé' && d.etat === 'Consuel OK')))
    return toMove.length
  }, [consuelEnCours])

  const traiterDAACT = useCallback(() => {
    const toMove = dpAccordes.filter(d => d.daact === true)
    if (!toMove.length) return 0
    setDAACT(p => [...p, ...toMove.map(d => ({ id: uid(), client: d.client, numeroDp: d.numeroDp, ville: d.ville, daact: true }))])
    setDPAcc(p => p.map(d => d.daact === true ? { ...d, daact: 'Archivé' } : d))
    return toMove.length
  }, [dpAccordes])

  return (
    <DataContext.Provider value={{
      dpEnCours, dpAccordes, dpRefus, consuelEnCours, consuelFinalise,
      raccordementEnCours, raccordementMES, daactData,
      updateDPEnCours, updateDPAccordes, updateDPRefus,
      updateConsuelEnCours, updateConsuelFinalise,
      updateRaccordementEnCours, updateRaccordementMES, updateDAACT,
      addDPEnCours, addDPAccordes, addDPRefus,
      addConsuelEnCours, addRaccordementEnCours, addDAACT,
      importDPEnCours, importDPAccordes, importDPRefus,
      importConsuelEnCours, importRaccordementEnCours, importDAACT,
      deleteDPEnCours, deleteDPAccordes, deleteDPRefus,
      deleteConsuelEnCours, deleteRaccordementEnCours, deleteDAACT,
      clearAll,
      archiverAccords, archiverRefus,
      archiverRaccordementMES, archiverConsuels, traiterDAACT,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData(): DataStore {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
