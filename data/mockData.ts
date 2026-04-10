export function excelDateToJS(serial: number | string | null): Date | null {
  if (!serial || typeof serial !== 'number') return null
  return new Date(Math.round((serial - 25569) * 86400 * 1000))
}

export type DPStatus = "En cours d'instruction" | 'Accord favorable' | 'Refus' | 'ABF' | 'ABF favorable' | 'En attente' | string

export interface DossierDP {
  id: string; client: string; dateEnvoi: number | null; attenteDP: number | null
  presta: string; financement: string; statut: DPStatus; numeroDp: string; ville: string
  siteDp?: string; email?: string; daact?: string | boolean
}

export interface DossierConsuel {
  id: string; nom: string; prenom: string; contrat: string
  dateSignature: number | null; dateMES: number | null; causeAbsence: string
  prestataire: string; etat: string; typeConsuel: string
  dateDerniereDemarche: number | null; commentaires: string
  dateEstimative: number | null; clientInforme: boolean; mes: boolean
}

export interface DossierRaccordement {
  id: string; client: string; numeroDp: string; ville: string
  presta: string; financement: string; dateDepot: number | null
  statut: string; commentaires?: string
}

export interface DossierDAACT {
  id: string; client: string; numeroDp: string; ville: string; daact: boolean
}

export const dpEnCours: DossierDP[] = []
export const dpAccordes: DossierDP[] = []
export const dpRefus: DossierDP[] = []
export const daactData: DossierDAACT[] = []
export const consuelEnCours: DossierConsuel[] = []
export const consuelFinalise: DossierConsuel[] = []
export const raccordementEnCours: DossierRaccordement[] = []
export const raccordementMES: DossierRaccordement[] = []
