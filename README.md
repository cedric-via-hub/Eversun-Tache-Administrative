# 📋 DP Dashboard – Suivi Administratif

Dashboard professionnel de suivi des dossiers administratifs photovoltaïques.
Construit avec **Next.js 15**, **React 19**, **TypeScript** et **Tailwind CSS**.

---

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour la production
npm run build
npm start
```

Accès : [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Structure du projet

```
dp-dashboard/
├── app/                        # Pages Next.js (App Router)
│   ├── page.tsx                # Dashboard principal (KPIs, alertes)
│   ├── dp-en-cours/page.tsx    # 📋 DP – En cours
│   ├── dp-accordes/page.tsx    # ✅ DP – Accordés + DAACT
│   ├── dp-refus/page.tsx       # ❌ DP – Refus
│   ├── consuel/page.tsx        # 🔵 Consuel (En cours / Finalisé)
│   ├── raccordement/page.tsx   # ⚡ Raccordement + MES
│   └── daact/page.tsx          # 📝 DAACT
├── components/
│   ├── Sidebar.tsx             # Navigation latérale
│   ├── KpiCard.tsx             # Carte indicateur
│   ├── StatusBadge.tsx         # Badge de statut coloré
│   ├── PageHeader.tsx          # En-tête de page
│   └── SearchInput.tsx         # Champ de recherche
├── data/
│   └── mockData.ts             # Données issues du fichier Excel
├── lib/
│   └── utils.ts                # Utilitaires (dates Excel, calculs)
└── google-apps-script/
    └── Code.gs                 # Script Apps Script complet
```

---

## 🤖 Automatisations portées en TypeScript

### `computeAttenteDP(dateEnvoi, statut)`
Calcule la date d'échéance de la DP :
- **+2 mois** si le statut contient `ABF`
- **+1 mois** sinon

Miroir exact du `onEdit` Google Apps Script.

### Logic de transfert (Apps Script)
| Déclencheur | Source → Destination |
|---|---|
| Statut = "Accord favorable" | DP En cours → DP Accordés |
| Statut = "Refus" | DP En cours → DP Refus |
| Col L cochée (true) | DP Accordés → DAACT |
| Statut = "Mise en service" | Raccordement → Raccordement MES |
| Cause = "Consuel envoyé" ET État = "Consuel OK" | Consuel En cours → Consuel Finalisé |

---

## 📊 Onglets couverts

| Onglet Excel | Route dashboard |
|---|---|
| 📋 DP – En cours | `/dp-en-cours` |
| ✅ DP – Accordés | `/dp-accordes` |
| ❌ DP – Refus | `/dp-refus` |
| 🔵 Consuel – En cours / ✅ Finalisé | `/consuel` |
| ⚡ Raccordement / 🏁 MES | `/raccordement` |
| ✅ DAACT | `/daact` |

---

## 📁 Google Apps Script

Le fichier `google-apps-script/Code.gs` contient l'intégralité des automatisations,
incluant les améliorations suivantes par rapport à la version initiale :

- ✅ `onEdit` : calcul automatique Attente DP (col C) à chaque modification col B ou F
- ✅ `recalculerToutesDatesDPEnCours()` : recalcul en masse de toute la colonne
- ✅ `traiterDAACT()` : transfert des lignes cochées + marquage "Archivé"
- ✅ `processTransfert()` : moteur générique de déplacement de dossiers

### Installation
1. Ouvrir le Google Sheet
2. Extensions → Apps Script
3. Coller le contenu de `Code.gs`
4. Enregistrer et autoriser le script
5. Actualiser le Sheet → menu "🛠️ ARCHIVER LES DOSSIERS" apparaît

---

## 🔧 Connecter les vraies données

Remplacer le contenu de `data/mockData.ts` par un appel API (Google Sheets API, backend, etc.) :

```ts
// Exemple avec Google Sheets API
export async function fetchDPEnCours(): Promise<DossierDP[]> {
  const res = await fetch('/api/sheets/dp-en-cours')
  return res.json()
}
```

---

## 🛠️ Stack technique

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 3**
- **Lucide React** (icônes)
- **DM Sans + DM Mono** (typographie)
