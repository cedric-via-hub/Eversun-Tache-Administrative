/**
 * ============================================================
 *  SUIVI ADMINISTRATIF — Google Apps Script
 *  Automatisations complètes : DP, Consuel, Raccordement, DAACT
 * ============================================================
 */

// ─────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────
const CONFIG = {
  DP_ACCORD: {
    src: "📋 DP – En cours",
    dest: "✅ DP – Accordés",
    condition: (row) => String(row[5]).trim() === "Accord favorable"
  },
  DP_REFUS: {
    src: "📋 DP – En cours",
    dest: "❌ DP – Refus",
    condition: (row) => String(row[5]).trim() === "Refus"
  },
  RACCORDEMENT: {
    src: "⚡ Raccordement",
    dest: "🏁 Raccordement – MES",
    condition: (row) => String(row[7]).trim() === "Mise en service"
  },
  CONSUEL: {
    src: "🔵 Consuel – En cours",
    dest: "✅ Consuel – Finalisé",
    condition: (row) =>
      String(row[5]).trim() === "Consuel envoyé" &&
      String(row[7]).trim() === "Consuel OK"
  },
  DAACT: {
    src: "✅ DP – Accordés",
    dest: "✅ DAACT",
    colCheck: 11  // Colonne L (index 11, base 0)
  }
};

// ─────────────────────────────────────────────
// MENU
// ─────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🛠️ ARCHIVER LES DOSSIERS")
    .addItem("✅ Archiver DP (Accords Favorables)", "archiverAccordsFavorables")
    .addItem("❌ Archiver DP (Refus)", "archiverRefusDP")
    .addSeparator()
    .addItem("🚀 Archiver Raccordements (Mise en service)", "archiverRaccordement")
    .addSeparator()
    .addItem("📁 Archiver Consuels (Visés)", "archiverConsuelsTermines")
    .addSeparator()
    .addItem("📝 Envoyer vers suivi DAACT", "traiterDAACT")
    .addSeparator()
    .addItem("🔄 Recalculer toutes les dates Attente DP", "recalculerToutesDatesDPEnCours")
    .addToUi();
}

// ─────────────────────────────────────────────
// DÉCLENCHEURS MENU
// ─────────────────────────────────────────────
function archiverAccordsFavorables() { processTransfert(CONFIG.DP_ACCORD); }
function archiverRefusDP()            { processTransfert(CONFIG.DP_REFUS); }
function archiverRaccordement()        { processTransfert(CONFIG.RACCORDEMENT); }
function archiverConsuelsTermines()    { processTransfert(CONFIG.CONSUEL); }

// ─────────────────────────────────────────────
// AUTOMATISATION onEdit — Calcul Attente DP
// ─────────────────────────────────────────────
/**
 * Se déclenche automatiquement à chaque modification d'une cellule.
 * - Si la feuille est "📋 DP – En cours" ET la colonne modifiée est B (date) ou F (statut) :
 *   → Recalcule la colonne C (Attente DP) avec +1 mois (ou +2 mois si ABF).
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "📋 DP – En cours") return;

  const col = e.range.getColumn();
  const row = e.range.getRow();

  if (row < 2) return; // ignorer l'en-tête
  if (col !== 2 && col !== 6) return;

  const dateCell  = sheet.getRange(row, 2);
  const dateValue = dateCell.getValue();

  if (!dateValue || !(dateValue instanceof Date)) {
    sheet.getRange(row, 3).clearContent();
    return;
  }

  const statut  = sheet.getRange(row, 6).getValue().toString().trim().toUpperCase();
  const newDate = new Date(dateValue);

  // +2 mois si ABF, sinon +1 mois
  newDate.setMonth(newDate.getMonth() + (statut.includes("ABF") ? 2 : 1));

  const cellC = sheet.getRange(row, 3);
  cellC.setValue(newDate);
  cellC.setNumberFormat("dd/mm/yyyy");
}

// ─────────────────────────────────────────────
// RECALCUL EN MASSE — Toutes les dates Attente DP
// ─────────────────────────────────────────────
/**
 * Recalcule toute la colonne C (Attente DP) du tableau DP – En cours
 * d'après la date d'envoi (col B) et le statut (col F).
 * Utile après un import de données ou une migration.
 */
function recalculerToutesDatesDPEnCours() {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const sheet  = ss.getSheetByName("📋 DP – En cours");
  const ui     = SpreadsheetApp.getUi();

  if (!sheet) {
    ui.alert("⚠️ Feuille '📋 DP – En cours' introuvable.");
    return;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    ui.alert("ℹ️ Aucune donnée à traiter.");
    return;
  }

  let updated = 0;

  for (let row = 2; row <= lastRow; row++) {
    const dateValue = sheet.getRange(row, 2).getValue();

    if (!dateValue || !(dateValue instanceof Date)) {
      sheet.getRange(row, 3).clearContent();
      continue;
    }

    const statut  = sheet.getRange(row, 6).getValue().toString().trim().toUpperCase();
    const newDate = new Date(dateValue);
    newDate.setMonth(newDate.getMonth() + (statut.includes("ABF") ? 2 : 1));

    const cellC = sheet.getRange(row, 3);
    cellC.setValue(newDate);
    cellC.setNumberFormat("dd/mm/yyyy");
    updated++;
  }

  ui.alert(`✅ ${updated} date(s) Attente DP recalculée(s).`);
}

// ─────────────────────────────────────────────
// ARCHIVAGE DAACT (logique spéciale)
// ─────────────────────────────────────────────
/**
 * Copie vers ✅ DAACT les lignes de ✅ DP – Accordés dont la case
 * de la colonne L est cochée (true). Remplace la coche par "Archivé".
 */
function traiterDAACT() {
  const cfg    = CONFIG.DAACT;
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const source = ss.getSheetByName(cfg.src);
  const cible  = ss.getSheetByName(cfg.dest);
  const ui     = SpreadsheetApp.getUi();

  if (!source || !cible) {
    ui.alert(`⚠️ Onglet '${cfg.src}' ou '${cfg.dest}' introuvable.`);
    return;
  }

  const lastRow = source.getLastRow();
  if (lastRow < 2) return;

  const data        = source.getRange(2, 1, lastRow - 1, source.getLastColumn()).getValues();
  const aTransferer = [];
  const lignesAMarquer = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i][cfg.colCheck] === true) {
      aTransferer.push([
        data[i][0],  // Col A — Client
        data[i][6],  // Col G — Numéro DP
        data[i][7]   // Col H — Ville
      ]);
      lignesAMarquer.push(i + 2);
    }
  }

  if (aTransferer.length === 0) {
    ui.alert("ℹ️ Aucun dossier à traiter (aucune case cochée en colonne L).");
    return;
  }

  // Écriture vers DAACT
  cible
    .getRange(cible.getLastRow() + 1, 1, aTransferer.length, 3)
    .setValues(aTransferer);

  // Remplacement des coches par "Archivé"
  lignesAMarquer.forEach(ligne => {
    source.getRange(ligne, cfg.colCheck + 1).setValue("Archivé");
  });

  ui.alert(`✅ ${aTransferer.length} dossier(s) envoyés vers DAACT et marqués "Archivé".`);
}

// ─────────────────────────────────────────────
// MOTEUR DE TRANSFERT GÉNÉRAL
// ─────────────────────────────────────────────
/**
 * Déplace les lignes correspondant à la condition de cfg.src vers cfg.dest.
 * Les lignes non déplacées sont conservées dans la feuille source.
 */
function processTransfert(cfg) {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const source = ss.getSheetByName(cfg.src);
  const cible  = ss.getSheetByName(cfg.dest);
  const ui     = SpreadsheetApp.getUi();

  if (!source || !cible) {
    ui.alert(`⚠️ Onglet '${cfg.src}' ou '${cfg.dest}' introuvable.`);
    return;
  }

  try {
    const lastRow  = source.getLastRow();
    if (lastRow < 2) return;

    const lastCol     = source.getLastColumn();
    const data        = source.getRange(2, 1, lastRow - 1, lastCol).getValues();
    const aConserver  = [];
    const aTransferer = [];

    for (let i = 0; i < data.length; i++) {
      if (cfg.condition(data[i])) {
        aTransferer.push(data[i]);
      } else {
        aConserver.push(data[i]);
      }
    }

    if (aTransferer.length === 0) {
      ui.alert("ℹ️ Aucun dossier éligible trouvé.");
      return;
    }

    // Copier vers la destination
    cible
      .getRange(cible.getLastRow() + 1, 1, aTransferer.length, lastCol)
      .setValues(aTransferer);

    // Vider la source, puis réécrire uniquement les lignes à conserver
    source.getRange(2, 1, lastRow - 1, lastCol).clearContent();

    if (aConserver.length > 0) {
      source
        .getRange(2, 1, aConserver.length, lastCol)
        .setValues(aConserver);
    }

    // Supprimer les lignes vides restantes
    const lignesVides = lastRow - 1 - aConserver.length;
    if (lignesVides > 0) {
      source.deleteRows(aConserver.length + 2, lignesVides);
    }

    ui.alert(`✅ Succès : ${aTransferer.length} dossier(s) déplacé(s) vers "${cfg.dest}".`);
  } catch (err) {
    ui.alert(`❌ Erreur : ${err.message}`);
  }
}
