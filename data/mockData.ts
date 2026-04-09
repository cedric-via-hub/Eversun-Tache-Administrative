// Utility: Convert Excel serial date to JS Date
export function excelDateToJS(serial: number | string | null): Date | null {
  if (!serial || typeof serial !== 'number') return null
  // Excel epoch: Dec 30, 1899
  const date = new Date(Math.round((serial - 25569) * 86400 * 1000))
  return date
}

export function formatDate(date: Date | null): string {
  if (!date) return '—'
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Compute Attente DP: date + 1 month (or 2 if ABF)
export function computeAttenteDP(dateEnvoi: Date | null, statut: string): Date | null {
  if (!dateEnvoi) return null
  const d = new Date(dateEnvoi)
  const isABF = statut.toUpperCase().includes('ABF')
  d.setMonth(d.getMonth() + (isABF ? 2 : 1))
  return d
}

// ────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────

export type DPStatus =
  | "En cours d'instruction"
  | 'Accord favorable'
  | 'Refus'
  | 'ABF'
  | 'ABF favorable'
  | 'En attente'
  | string

export interface DossierDP {
  id: string
  client: string
  dateEnvoi: number | null   // Excel serial
  attenteDP: number | null   // Excel serial (computed)
  presta: string
  financement: string
  statut: DPStatus
  numeroDp: string
  ville: string
  siteDp?: string
  email?: string
  daact?: string | boolean
}

export interface DossierConsuel {
  id: string
  nom: string
  prenom: string
  contrat: string
  dateSignature: number | null
  dateMES: number | null
  causeAbsence: string
  prestataire: string
  etat: string
  typeConsuel: string
  dateDerniereDemarche: number | null
  commentaires: string
  dateEstimative: number | null
  clientInforme: boolean
  mes: boolean
}

export interface DossierRaccordement {
  id: string
  client: string
  numeroDp: string
  ville: string
  presta: string
  financement: string
  dateDepot: number | null
  statut: string
  commentaires?: string
}

export interface DossierDAACT {
  id: string
  client: string
  numeroDp: string
  ville: string
  daact: boolean
}

// ────────────────────────────────────────────
// 📋 DP – EN COURS (20 dossiers)
// ────────────────────────────────────────────

export const dpEnCours: DossierDP[] = [
  { id: 'dp-ec-1',  client: 'DUPRIEZ',       dateEnvoi: 45960, attenteDP: 45998, presta: 'Eversun',  financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP0333002500031',     ville: 'Naujac sur Mer',        siteDp: 'https://portail-usager.sirap.com/',                               email: 'thibaud@eversun.fr' },
  { id: 'dp-ec-2',  client: 'PRIMO',         dateEnvoi: 46009, attenteDP: 46040, presta: 'Eversun',  financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 86066 25 H4586',  ville: 'Châtellerault',          siteDp: 'https://mesdemarches-urbanisme.grand-chatellerault.fr/gnau/#/',   email: 'thibaud@eversun.fr' },
  { id: 'dp-ec-3',  client: 'CAUZARD',       dateEnvoi: 46101, attenteDP: 46132, presta: 'Eversun',  financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 083 104 26 00011', ville: 'Rians',                  siteDp: 'https://provence-verdon.geosphere.fr/guichet-urba',               email: 'c.via@eversun.fr' },
  { id: 'dp-ec-4',  client: 'Heimburger',    dateEnvoi: null,  attenteDP: null,  presta: 'Eversun',  financement: 'Otovo',  statut: 'ABF',                    numeroDp: 'DP 068 123 26 B 0002',ville: 'Hattstatt',              siteDp: 'https://app.geo-soft.fr',                                         email: 'c.via@eversun.fr' },
  { id: 'dp-ec-5',  client: 'MARQUES',       dateEnvoi: 46085, attenteDP: 46116, presta: 'Eversun',  financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 034 156 26 00007', ville: 'Montpellier',            siteDp: '',                                                                email: 'thibaud@eversun.fr' },
  { id: 'dp-ec-6',  client: 'BERNARD',       dateEnvoi: 46090, attenteDP: 46121, presta: 'Dessineo', financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 059 123 26 00044', ville: 'Lille',                  siteDp: '',                                                                email: 'thibaud@eversun.fr' },
  { id: 'dp-ec-7',  client: 'FONTAINE',      dateEnvoi: 46095, attenteDP: 46157, presta: 'Eversun',  financement: 'Otovo',  statut: 'ABF',                    numeroDp: 'DP 067 052 26 00012', ville: 'Colmar',                 siteDp: 'https://app.geo-soft.fr',                                         email: 'c.via@eversun.fr' },
  { id: 'dp-ec-8',  client: 'PEREZ',         dateEnvoi: 46100, attenteDP: 46131, presta: 'Eversun',  financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 031 445 26 00018', ville: 'Toulouse',               siteDp: '',                                                                email: 'thibaud@eversun.fr' },
  { id: 'dp-ec-9',  client: 'NGUYEN',        dateEnvoi: 46088, attenteDP: 46119, presta: 'Dessineo', financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 013 205 26 00031', ville: 'Marseille',              siteDp: '',                                                                email: 'c.via@eversun.fr' },
  { id: 'dp-ec-10', client: 'MORIN',         dateEnvoi: 46093, attenteDP: 46124, presta: 'Eversun',  financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 044 218 26 00009', ville: 'Nantes',                 siteDp: '',                                                                email: 'thibaud@eversun.fr' },
  { id: 'dp-ec-11', client: 'SIMON',         dateEnvoi: 46097, attenteDP: 46128, presta: 'Eversun',  financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 033 421 26 00023', ville: 'Bordeaux',               siteDp: '',                                                                email: 'thibaud@eversun.fr' },
  { id: 'dp-ec-12', client: 'LAMBERT',       dateEnvoi: 46070, attenteDP: 46132, presta: 'Eversun',  financement: 'Otovo',  statut: 'ABF',                    numeroDp: 'DP 075 312 26 A 0005', ville: 'Paris 15e',             siteDp: '',                                                                email: 'c.via@eversun.fr' },
  { id: 'dp-ec-13', client: 'MARTIN',        dateEnvoi: 46105, attenteDP: 46136, presta: 'Dessineo', financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 069 087 26 00041', ville: 'Lyon',                   siteDp: '',                                                                email: 'thibaud@eversun.fr' },
  { id: 'dp-ec-14', client: 'ROBERT',        dateEnvoi: 46078, attenteDP: 46109, presta: 'Eversun',  financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 006 512 26 00007', ville: 'Nice',                   siteDp: '',                                                                email: 'thibaud@eversun.fr' },
  { id: 'dp-ec-15', client: 'RICHARD',       dateEnvoi: 46082, attenteDP: 46144, presta: 'Eversun',  financement: 'Otovo',  statut: 'ABF favorable',          numeroDp: 'DP 067 341 26 B 0009', ville: 'Strasbourg',            siteDp: '',                                                                email: 'c.via@eversun.fr' },
  { id: 'dp-ec-16', client: 'THOMAS',        dateEnvoi: 46110, attenteDP: 46141, presta: 'Eversun',  financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 092 006 26 00014', ville: 'Nanterre',               siteDp: '',                                                                email: 'thibaud@eversun.fr' },
  { id: 'dp-ec-17', client: 'GARCIA',        dateEnvoi: 46088, attenteDP: 46119, presta: 'Dessineo', financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 034 871 26 00028', ville: 'Montpellier',            siteDp: '',                                                                email: 'c.via@eversun.fr' },
  { id: 'dp-ec-18', client: 'MARTINEZ',      dateEnvoi: 46076, attenteDP: 46107, presta: 'Eversun',  financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 013 789 26 00035', ville: 'Aix-en-Provence',       siteDp: '',                                                                email: 'thibaud@eversun.fr' },
  { id: 'dp-ec-19', client: 'LEFEBVRE',      dateEnvoi: 46115, attenteDP: 46146, presta: 'Eversun',  financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 076 143 26 00019', ville: 'Rouen',                  siteDp: '',                                                                email: 'thibaud@eversun.fr' },
  { id: 'dp-ec-20', client: 'LEROY',         dateEnvoi: 46098, attenteDP: 46129, presta: 'Dessineo', financement: 'SunLib', statut: "En cours d'instruction", numeroDp: 'DP 062 201 26 00052', ville: 'Lens',                   siteDp: '',                                                                email: 'thibaud@eversun.fr' },
]

// ────────────────────────────────────────────
// ✅ DP – ACCORDÉS (70 dossiers, excerpt of key ones)
// ────────────────────────────────────────────

export const dpAccordes: DossierDP[] = [
  { id: 'dp-ac-1',  client: 'Martello',           dateEnvoi: 45764, attenteDP: 45794, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 062 645 25 00043', ville: 'Oye Plage',             daact: 'Archivé' },
  { id: 'dp-ac-2',  client: 'Mastrolorenzo',       dateEnvoi: 45765, attenteDP: 45795, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 034 035 25 00012', ville: 'La Boissière',          daact: false },
  { id: 'dp-ac-3',  client: 'Labre',               dateEnvoi: 45784, attenteDP: 45796, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 059477 25 00027',  ville: 'Provin',                daact: 'Archivé', email: 'thibaud@eversun.fr' },
  { id: 'dp-ac-4',  client: 'SARRAUD',             dateEnvoi: 46073, attenteDP: 46101, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 17053 26 00002',   ville: 'Bords',                 daact: 'Archivé', email: 'f.randrianarivo@eversun.fr', siteDp: 'https://www.urbanisme17.fr/gnaucdcvalsdesaintonge/#/' },
  { id: 'dp-ac-5',  client: 'DEBACKER',            dateEnvoi: 45810, attenteDP: 45840, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 059 200 25 00089', ville: 'Douai',                 daact: false },
  { id: 'dp-ac-6',  client: 'MANCEAU',             dateEnvoi: 45820, attenteDP: 45851, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 072 321 25 00014', ville: 'Le Mans',               daact: 'Archivé' },
  { id: 'dp-ac-7',  client: 'FERRAND',             dateEnvoi: 45835, attenteDP: 45866, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 063 112 25 00033', ville: 'Clermont-Ferrand',       daact: false },
  { id: 'dp-ac-8',  client: 'BLANC',               dateEnvoi: 45850, attenteDP: 45880, presta: 'Eversun',  financement: 'Otovo',  statut: 'Accord favorable', numeroDp: 'DP 038 421 25 00071', ville: 'Grenoble',              daact: 'Archivé' },
  { id: 'dp-ac-9',  client: 'ROUSSEAU',            dateEnvoi: 45860, attenteDP: 45891, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 045 312 25 00019', ville: 'Tours',                 daact: false },
  { id: 'dp-ac-10', client: 'MOREAU',              dateEnvoi: 45870, attenteDP: 45901, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 044 089 25 00041', ville: 'Angers',                daact: 'Archivé' },
  { id: 'dp-ac-11', client: 'DUPONT',              dateEnvoi: 45880, attenteDP: 45910, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 051 344 25 00025', ville: 'Dijon',                 daact: false },
  { id: 'dp-ac-12', client: 'MICHAUD',             dateEnvoi: 45890, attenteDP: 45920, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 057 201 25 00016', ville: 'Metz',                  daact: 'Archivé' },
  { id: 'dp-ac-13', client: 'VIDAL',               dateEnvoi: 45900, attenteDP: 45931, presta: 'Eversun',  financement: 'Otovo',  statut: 'Accord favorable', numeroDp: 'DP 034 567 25 00044', ville: 'Sète',                  daact: false },
  { id: 'dp-ac-14', client: 'GIRARD',              dateEnvoi: 45910, attenteDP: 45941, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 069 432 25 00062', ville: 'Villeurbanne',          daact: 'Archivé' },
  { id: 'dp-ac-15', client: 'BONNET',              dateEnvoi: 45920, attenteDP: 45951, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 006 213 25 00091', ville: 'Cannes',                daact: false },
  { id: 'dp-ac-16', client: 'CHEVALIER',           dateEnvoi: 45930, attenteDP: 45960, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 013 876 25 00038', ville: 'Toulon',                daact: 'Archivé' },
  { id: 'dp-ac-17', client: 'FAURE',               dateEnvoi: 45940, attenteDP: 45971, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 033 129 25 00053', ville: 'Mérignac',              daact: false },
  { id: 'dp-ac-18', client: 'MARCHAND',            dateEnvoi: 45950, attenteDP: 45981, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 031 784 25 00037', ville: 'Toulouse',              daact: 'Archivé' },
  { id: 'dp-ac-19', client: 'RENARD',              dateEnvoi: 45960, attenteDP: 45991, presta: 'Eversun',  financement: 'Otovo',  statut: 'Accord favorable', numeroDp: 'DP 076 321 25 00011', ville: 'Le Havre',              daact: false },
  { id: 'dp-ac-20', client: 'LECOMTE',             dateEnvoi: 45970, attenteDP: 46001, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 016 443 25 00028', ville: 'Reims',                 daact: 'Archivé' },
  { id: 'dp-ac-21', client: 'AUBERT',              dateEnvoi: 45980, attenteDP: 46011, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 049 211 25 00047', ville: 'Angers',                daact: false },
  { id: 'dp-ac-22', client: 'GILLES',              dateEnvoi: 45990, attenteDP: 46021, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 014 563 25 00019', ville: 'Bordeaux Nord',         daact: 'Archivé' },
  { id: 'dp-ac-23', client: 'PERRIN',              dateEnvoi: 46000, attenteDP: 46031, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 038 245 25 00082', ville: 'Grenoble Est',          daact: false },
  { id: 'dp-ac-24', client: 'MOREL',               dateEnvoi: 46010, attenteDP: 46041, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 062 189 25 00096', ville: 'Arras',                 daact: 'Archivé' },
  { id: 'dp-ac-25', client: 'CARON',               dateEnvoi: 46020, attenteDP: 46051, presta: 'Eversun',  financement: 'Otovo',  statut: 'Accord favorable', numeroDp: 'DP 030 412 25 00014', ville: 'Nîmes',                 daact: false },
  { id: 'dp-ac-26', client: 'PICARD',              dateEnvoi: 46030, attenteDP: 46061, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 054 321 25 00077', ville: 'Nancy',                 daact: 'Archivé' },
  { id: 'dp-ac-27', client: 'ADAM',                dateEnvoi: 46040, attenteDP: 46071, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 056 188 25 00063', ville: 'Lorient',               daact: false },
  { id: 'dp-ac-28', client: 'HENRY',               dateEnvoi: 46050, attenteDP: 46081, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 050 321 25 00028', ville: 'Saint-Malo',            daact: 'Archivé' },
  { id: 'dp-ac-29', client: 'POIRIER',             dateEnvoi: 46060, attenteDP: 46091, presta: 'Eversun',  financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 086 241 25 00051', ville: 'Poitiers',              daact: false },
  { id: 'dp-ac-30', client: 'GAUTIER',             dateEnvoi: 46070, attenteDP: 46101, presta: 'Dessineo', financement: 'SunLib', statut: 'Accord favorable', numeroDp: 'DP 067 312 25 00089', ville: 'Strasbourg Est',        daact: 'Archivé' },
  // Remaining 40 entries (abbreviated for brevity)
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `dp-ac-${31 + i}`,
    client: ['DUVAL', 'KLEIN', 'MEYER', 'SCHMITT', 'WEBER', 'FISCHER', 'WAGNER', 'BECKER', 'WOLF', 'RICHTER',
             'MAIER', 'HOFFMANN', 'KRAUSE', 'LANGE', 'BAUER', 'JUNG', 'BRAUN', 'PETER', 'WALTER', 'KOHL',
             'SCHNEIDER', 'MÜLLER', 'SCHÄFER', 'HUBER', 'GRUBER', 'BAUMANN', 'VOGEL', 'ROTH', 'KOCH', 'BAUER',
             'HARTMANN', 'ZIMMERMANN', 'SCHWARZ', 'KRÜGER', 'SAUER', 'LÜKE', 'FRANK', 'ZIEGLER', 'KLEIN2', 'WALTER2'][i],
    dateEnvoi: 45750 + i * 8,
    attenteDP: 45780 + i * 8,
    presta: i % 2 === 0 ? 'Eversun' : 'Dessineo',
    financement: i % 3 === 0 ? 'Otovo' : 'SunLib',
    statut: 'Accord favorable' as DPStatus,
    numeroDp: `DP 0${String(31 + i).padStart(2, '0')} ${String(400 + i * 3).padStart(3, '0')} 25 ${String(10000 + i).padStart(5, '0')}`,
    ville: ['Lyon', 'Paris', 'Bordeaux', 'Nantes', 'Marseille', 'Rennes', 'Lille', 'Nice', 'Metz', 'Reims'][i % 10],
    daact: i % 3 === 0 ? 'Archivé' : false,
  }))
]

// ────────────────────────────────────────────
// ❌ DP – REFUS (3 dossiers)
// ────────────────────────────────────────────

export const dpRefus: DossierDP[] = [
  { id: 'dp-ref-1', client: 'CONTREAU',          dateEnvoi: 46043, attenteDP: 46075, presta: 'Eversun',  financement: 'SunLib', statut: 'Refus', numeroDp: 'DP 021 116 26 M0001', ville: 'Bure-les-Templiers' },
  { id: 'dp-ref-2', client: 'Florence Crocherie', dateEnvoi: 46112, attenteDP: 46143, presta: 'Eversun',  financement: 'Otovo',  statut: 'Refus', numeroDp: 'DP 031584 26 00029',  ville: 'Villemur sur Tarn', siteDp: 'https://gnau24.operis.fr/valaigo/gnau', email: 'c.via@eversun.fr' },
  { id: 'dp-ref-3', client: 'DUPUY',              dateEnvoi: 45940, attenteDP: 45971, presta: 'Eversun',  financement: 'SunLib', statut: 'Refus', numeroDp: 'DP 033 063 25 02825',  ville: 'Bordeaux', siteDp: 'https://urbanisme.bordeaux-metropole.fr/', email: 'thibaud@eversun.fr' },
]

// ────────────────────────────────────────────
// ✅ DAACT (40 dossiers)
// ────────────────────────────────────────────

export const daactData: DossierDAACT[] = [
  { id: 'daact-1',  client: 'SIVAPATHASUNDARAM', numeroDp: 'DP 45254 25 Z0061',     ville: 'Poilly-lez-Gien',    daact: true },
  { id: 'daact-2',  client: 'Maillard',           numeroDp: 'DP 26085 25 00044',     ville: 'Chateauneuf-du-Rhône', daact: true },
  { id: 'daact-3',  client: 'Donnarumma',          numeroDp: 'DP 057 221 2500067',    ville: '—',                  daact: true },
  { id: 'daact-4',  client: 'DUFOUR',              numeroDp: 'DP 022 122 26 00001',   ville: 'Laurénan',           daact: true },
  { id: 'daact-5',  client: 'Martello',            numeroDp: 'DP 062 645 25 00043',   ville: 'Oye Plage',          daact: true },
  { id: 'daact-6',  client: 'Labre',               numeroDp: 'DP 059477 25 00027',    ville: 'Provin',             daact: true },
  { id: 'daact-7',  client: 'SARRAUD',             numeroDp: 'DP 17053 26 00002',     ville: 'Bords',              daact: true },
  { id: 'daact-8',  client: 'MANCEAU',             numeroDp: 'DP 072 321 25 00014',   ville: 'Le Mans',            daact: true },
  { id: 'daact-9',  client: 'BLANC',               numeroDp: 'DP 038 421 25 00071',   ville: 'Grenoble',           daact: true },
  { id: 'daact-10', client: 'MOREAU',              numeroDp: 'DP 044 089 25 00041',   ville: 'Angers',             daact: true },
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `daact-${11 + i}`,
    client: ['MICHAUD', 'GIRARD', 'CHEVALIER', 'MARCHAND', 'LECOMTE', 'GILLES', 'MOREL', 'PICARD', 'HENRY', 'GAUTIER',
             'RENARD', 'FAURE', 'BONNET', 'PERRIN', 'CARON', 'ADAM', 'POIRIER', 'AUBERT', 'DUPONT', 'ROUSSEAU',
             'FERRAND', 'VIDAL', 'DEBACKER', 'KLEIN', 'WEBER', 'BECKER', 'WOLF', 'BRAUN', 'JUNG', 'HOFFMANN'][i],
    numeroDp: `DP 0${String(i + 40).padStart(2, '0')} ${String(i * 7 + 100).padStart(3, '0')} 25 ${String(10100 + i * 2).padStart(5, '0')}`,
    ville: ['Paris', 'Lyon', 'Metz', 'Nantes', 'Bordeaux', 'Nice', 'Rennes', 'Strasbourg', 'Toulon', 'Grenoble'][i % 10],
    daact: true,
  }))
]

// ────────────────────────────────────────────
// 🔵 CONSUEL – EN COURS
// ────────────────────────────────────────────

export const consuelEnCours: DossierConsuel[] = [
  { id: 'con-ec-1',  nom: 'BERTIN',    prenom: 'Jean-Pierre',       contrat: 'SL-001092', dateSignature: 46091, dateMES: 46100, causeAbsence: 'Consuel envoyé', prestataire: 'Eversun',  etat: 'En attente',  typeConsuel: 'Bleu', dateDerniereDemarche: 46105, commentaires: 'En attente retour',             dateEstimative: 46120, clientInforme: true,  mes: false },
  { id: 'con-ec-2',  nom: 'ROUSSEL',   prenom: 'Marie',             contrat: 'SL-001084', dateSignature: 46075, dateMES: 46085, causeAbsence: 'Consuel envoyé', prestataire: 'Eversun',  etat: 'En attente',  typeConsuel: 'Bleu', dateDerniereDemarche: 46095, commentaires: 'Visite planifiée',               dateEstimative: 46110, clientInforme: true,  mes: false },
  { id: 'con-ec-3',  nom: 'LAMBERT',   prenom: 'Sophie',            contrat: 'SL-001077', dateSignature: 46060, dateMES: 46072, causeAbsence: 'Consuel envoyé', prestataire: 'Dessineo', etat: 'En attente',  typeConsuel: 'Rouge',dateDerniereDemarche: 46085, commentaires: 'Modification requise',            dateEstimative: 46115, clientInforme: false, mes: false },
  { id: 'con-ec-4',  nom: 'PEREZ',     prenom: 'Carlos',            contrat: 'SL-001063', dateSignature: 46050, dateMES: 46062, causeAbsence: 'Consuel envoyé', prestataire: 'Eversun',  etat: 'En attente',  typeConsuel: 'Bleu', dateDerniereDemarche: 46080, commentaires: 'Dossier complet',                dateEstimative: 46100, clientInforme: true,  mes: false },
  { id: 'con-ec-5',  nom: 'MARTIN',    prenom: 'Isabelle',          contrat: 'SL-001058', dateSignature: 46045, dateMES: 46058, causeAbsence: 'Non présent',    prestataire: 'Dessineo', etat: 'En attente',  typeConsuel: 'Bleu', dateDerniereDemarche: 46078, commentaires: 'RDV à reprendre',                dateEstimative: 46108, clientInforme: false, mes: false },
  { id: 'con-ec-6',  nom: 'DURAND',    prenom: 'Luc',               contrat: 'SL-001051', dateSignature: 46040, dateMES: 46052, causeAbsence: 'Consuel envoyé', prestataire: 'Eversun',  etat: 'En attente',  typeConsuel: 'Bleu', dateDerniereDemarche: 46072, commentaires: 'En cours de traitement',          dateEstimative: 46092, clientInforme: true,  mes: false },
  { id: 'con-ec-7',  nom: 'GILLET',    prenom: 'Nathalie',          contrat: 'SL-001045', dateSignature: 46033, dateMES: 46045, causeAbsence: 'Consuel envoyé', prestataire: 'Eversun',  etat: 'En attente',  typeConsuel: 'Rouge',dateDerniereDemarche: 46068, commentaires: 'Avis défavorable préalable',      dateEstimative: 46105, clientInforme: true,  mes: false },
  { id: 'con-ec-8',  nom: 'FONTAINE',  prenom: 'Pierre',            contrat: 'SL-001039', dateSignature: 46020, dateMES: 46038, causeAbsence: 'Non présent',    prestataire: 'Dessineo', etat: 'En attente',  typeConsuel: 'Bleu', dateDerniereDemarche: 46060, commentaires: 'Nouveau RDV planifié 15/04',      dateEstimative: 46098, clientInforme: false, mes: false },
]

// ────────────────────────────────────────────
// ✅ CONSUEL – FINALISÉ (30 dossiers)
// ────────────────────────────────────────────

export const consuelFinalise: DossierConsuel[] = [
  { id: 'con-fin-1',  nom: 'VICTOR',    prenom: 'Dufour',            contrat: 'SL-001074', dateSignature: 46087, dateMES: 46091, causeAbsence: 'Consuel envoyé', prestataire: 'Eversun',  etat: 'Consuel OK', typeConsuel: 'Bleu', dateDerniereDemarche: 46097, commentaires: 'Visé le 18/03/2026 // uploaded in CRM', dateEstimative: 46115, clientInforme: true,  mes: true  },
  { id: 'con-fin-2',  nom: 'GABORY',    prenom: 'Laurent et Mireille',contrat: 'SL-001050', dateSignature: 46010, dateMES: 46064, causeAbsence: 'Consuel envoyé', prestataire: 'Eversun',  etat: 'Consuel OK', typeConsuel: 'Bleu', dateDerniereDemarche: 46093, commentaires: 'Visé le 16/03/2026',                     dateEstimative: 46111, clientInforme: true,  mes: false },
  ...Array.from({ length: 28 }, (_, i) => ({
    id: `con-fin-${3 + i}`,
    nom: ['DUPONT', 'MARTIN', 'BERNARD', 'DURAND', 'PETIT', 'LEGRAND', 'SIMON', 'MORIN', 'LEFEBVRE', 'LEROY',
          'ROUX', 'DAVID', 'BERTRAND', 'MOREAU', 'FLEURY', 'GIRARD', 'BONNET', 'BLANC', 'GARNIER', 'FAVRE',
          'CHEVALIER', 'FRANCOIS', 'ROBIN', 'GAUTIER', 'HENRY', 'ROUSSEL', 'LACROIX', 'CLEMENT', 'CARRE', 'POIRIER'][i],
    prenom: ['Jean', 'Marie', 'Pierre', 'Sophie', 'Luc', 'Claire', 'Thomas', 'Julie', 'Marc', 'Anne',
             'Paul', 'Emma', 'Henri', 'Camille', 'Denis', 'Lucie', 'Robert', 'Nathalie', 'Jacques', 'Isabelle',
             'Michel', 'Hélène', 'Patrick', 'Christine', 'Eric', 'Nicole', 'Laurent', 'Sandrine', 'Alain', 'Valérie'][i],
    contrat: `SL-${String(1001 + i).padStart(6, '0')}`,
    dateSignature: 45800 + i * 7,
    dateMES: 45830 + i * 7,
    causeAbsence: 'Consuel envoyé',
    prestataire: i % 2 === 0 ? 'Eversun' : 'Dessineo',
    etat: 'Consuel OK',
    typeConsuel: i % 4 === 0 ? 'Rouge' : 'Bleu',
    dateDerniereDemarche: 45860 + i * 7,
    commentaires: `Visé le ${String(i + 1).padStart(2, '0')}/02/2026`,
    dateEstimative: 45890 + i * 7,
    clientInforme: true,
    mes: i % 3 !== 0,
  }))
]

// ────────────────────────────────────────────
// ⚡ RACCORDEMENT – EN COURS
// ────────────────────────────────────────────

export const raccordementEnCours: DossierRaccordement[] = [
  { id: 'rac-ec-1',  client: 'FONTAINE',     numeroDp: 'DP 067 052 26 00012', ville: 'Colmar',            presta: 'Eversun',  financement: 'Otovo',  dateDepot: 46090, statut: 'En attente Enedis',   commentaires: 'Dossier déposé' },
  { id: 'rac-ec-2',  client: 'RICHARD',      numeroDp: 'DP 067 341 26 B 0009',ville: 'Strasbourg',        presta: 'Eversun',  financement: 'Otovo',  dateDepot: 46085, statut: 'En attente Enedis',   commentaires: 'Dossier complet' },
  { id: 'rac-ec-3',  client: 'THOMAS',       numeroDp: 'DP 092 006 26 00014', ville: 'Nanterre',          presta: 'Eversun',  financement: 'SunLib', dateDepot: 46075, statut: 'Consuel OK',           commentaires: 'En attente MES Enedis' },
  { id: 'rac-ec-4',  client: 'GARCIA',       numeroDp: 'DP 034 871 26 00028', ville: 'Montpellier',       presta: 'Dessineo', financement: 'SunLib', dateDepot: 46080, statut: 'En attente Enedis',   commentaires: 'Délai 3 semaines estimé' },
  { id: 'rac-ec-5',  client: 'MARTINEZ',     numeroDp: 'DP 013 789 26 00035', ville: 'Aix-en-Provence',  presta: 'Eversun',  financement: 'SunLib', dateDepot: 46070, statut: 'Raccordé',             commentaires: 'Raccordement effectué, MES à programmer' },
  { id: 'rac-ec-6',  client: 'LEFEBVRE',     numeroDp: 'DP 076 143 26 00019', ville: 'Rouen',             presta: 'Eversun',  financement: 'SunLib', dateDepot: 46095, statut: 'En attente Enedis',   commentaires: 'En cours de traitement' },
  { id: 'rac-ec-7',  client: 'LEROY',        numeroDp: 'DP 062 201 26 00052', ville: 'Lens',              presta: 'Dessineo', financement: 'SunLib', dateDepot: 46098, statut: 'En attente Enedis',   commentaires: 'Pièces manquantes' },
  { id: 'rac-ec-8',  client: 'DUPRIEZ',      numeroDp: 'DP0333002500031',     ville: 'Naujac sur Mer',   presta: 'Eversun',  financement: 'SunLib', dateDepot: 45980, statut: 'Consuel OK',           commentaires: 'Prêt pour MES' },
  { id: 'rac-ec-9',  client: 'SIMON',        numeroDp: 'DP 033 421 26 00023', ville: 'Bordeaux',          presta: 'Eversun',  financement: 'SunLib', dateDepot: 46060, statut: 'En attente Enedis',   commentaires: 'Nouvelle demande envoyée' },
  { id: 'rac-ec-10', client: 'LAMBERT',      numeroDp: 'DP 075 312 26 A 0005',ville: 'Paris 15e',        presta: 'Eversun',  financement: 'Otovo',  dateDepot: 46055, statut: 'Raccordé',             commentaires: 'Raccordé – en attente Consuel' },
]

// ────────────────────────────────────────────
// 🏁 RACCORDEMENT – MES (Mis en Service)
// ────────────────────────────────────────────

export const raccordementMES: DossierRaccordement[] = [
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `rac-mes-${i + 1}`,
    client: ['Martello', 'Mastrolorenzo', 'Labre', 'SARRAUD', 'DEBACKER', 'MANCEAU', 'FERRAND', 'BLANC', 'ROUSSEAU', 'MOREAU',
             'DUPONT', 'MICHAUD', 'VIDAL', 'GIRARD', 'BONNET', 'CHEVALIER', 'FAURE', 'MARCHAND'][i],
    numeroDp: `DP ${String(62 + i).padStart(3, '0')} ${String(600 + i * 5).padStart(3, '0')} 25 ${String(10200 + i).padStart(5, '0')}`,
    ville: ['Oye Plage', 'La Boissière', 'Provin', 'Bords', 'Douai', 'Le Mans', 'Clermont-Ferrand', 'Grenoble', 'Tours', 'Angers',
            'Dijon', 'Metz', 'Sète', 'Villeurbanne', 'Cannes', 'Toulon', 'Mérignac', 'Toulouse'][i],
    presta: i % 2 === 0 ? 'Dessineo' : 'Eversun',
    financement: i % 3 === 0 ? 'Otovo' : 'SunLib',
    dateDepot: 45750 + i * 10,
    statut: 'Mise en service',
    commentaires: `Mise en service effectuée`,
  }))
]

// ────────────────────────────────────────────
// STATS GLOBALES
// ────────────────────────────────────────────

export function getStats() {
  const totalDossiers =
    dpEnCours.length + dpAccordes.length + dpRefus.length +
    consuelEnCours.length + consuelFinalise.length +
    raccordementEnCours.length + raccordementMES.length

  const dpEnCoursABF = dpEnCours.filter(d =>
    d.statut.toUpperCase().includes('ABF')
  ).length

  const consuelEnAttente = consuelEnCours.length
  const raccordementEnAttente = raccordementEnCours.filter(d =>
    d.statut === 'En attente Enedis'
  ).length

  const daactArchives = dpAccordes.filter(d => d.daact === 'Archivé').length
  const daactTotal = dpAccordes.length

  const tauxAccord = Math.round(
    (dpAccordes.length / (dpAccordes.length + dpRefus.length)) * 100
  )

  return {
    totalDossiers,
    dpEnCours: dpEnCours.length,
    dpAccordes: dpAccordes.length,
    dpRefus: dpRefus.length,
    dpEnCoursABF,
    consuelEnAttente,
    consuelFinalise: consuelFinalise.length,
    raccordementEnAttente,
    raccordementMES: raccordementMES.length,
    daactArchives,
    daactTotal,
    daactEnAttente: daactData.filter(d => !d.daact).length,
    tauxAccord,
  }
}
