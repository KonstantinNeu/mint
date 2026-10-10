// Sprachen: Deutsch, Englisch, Italienisch, Französisch
// Muss vor einstellungen.js geladen werden. Die gewählte Sprache steht in einstellungen.sprache.
//
// So wird übersetzt:
// - Feste Texte in index.html tragen data-i18n="schluessel" (Text), data-i18n-html (Text mit Auszeichnung),
//   data-i18n-aria (Beschriftung für Screenreader), data-i18n-ph (Platzhalter) oder data-i18n-phw
//   (Platzhalter mit angehängtem Währungszeichen).
// - Texte aus JavaScript holen sich ihre Übersetzung mit t("schluessel").
// - Namen, die gespeichert werden (Kategorien, Fixkosten, Sonderzahlungen), bleiben intern deutsch
//   und werden nur beim Anzeigen mit tName() übersetzt. Eigene Namen bleiben unverändert.

const SPRACHEN = {
  de: { name: "Deutsch", locale: "de-DE" },
  en: { name: "English", locale: "en-GB" },
  it: { name: "Italiano", locale: "it-IT" },
  fr: { name: "Français", locale: "fr-FR" }
};

const MONATE_KURZ = {
  de: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  it: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]
};

const WOCHENTAGE_KURZ = {
  de: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  it: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
  fr: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."]
};

const TEXTE = {
  de: {
    tippen: "TIPPEN ZUM ÖFFNEN",
    intro_aria: "Mint öffnen",
    zur_uebersicht: "Zur Übersicht",
    voriger_monat: "Voriger Monat",
    naechster_monat: "Nächster Monat",
    nav_uebersicht: "Übersicht", nav_einkommen: "Einkommen", nav_fixkosten: "Fixkosten",
    nav_ausgaben: "Ausgaben", nav_budget: "Budget", nav_ruecklage: "Sparen",
    ue_ueberschuss: "Monatsüberschuss", einnahmen: "Einnahmen", ue_ausgaben: "Tägliche Ausgaben",
    ue_ruecklage: "Gespart gesamt",
    betrag_in: "Betrag in", bud_in: "Budget in", buchen: "Buchen",
    ein_gesamt: "Einnahmen gesamt", ein_gehalt: "Grundgehalt (netto)",
    ein_gilt_ab: "Gilt ab dem angezeigten Monat für alle folgenden Monate.",
    ein_sonder: "Sonderzahlungen", bezeichnung: "Bezeichnung",
    sz_Weihnachtsgeld: "Weihnachtsgeld", sz_Urlaubsgeld: "Urlaubsgeld", sz_Provision: "Provision",
    sz_Steuerausgleich: "Steuerausgleich", sz_Anderes: "Anderes",
    noch_nichts: "Noch nichts eingetragen.", aktuell: "Aktuell:",
    fix_gesamt: "Fixkosten gesamt",
    fix_hinweis: 'Ein Betrag gilt ab dem angezeigten Monat für alle folgenden Monate. Wenn Kosten enden, trage <span class="zahl">0</span> ein.',
    fix_Miete: "Miete", fix_Strom: "Strom", fix_Handy: "Handy", fix_Internet: "Internet", fix_Auto: "Auto",
    fix_Privatkonkurs: "Privatkonkurs", fix_Playstation: "Playstation", fix_Gym: "Gym", fix_KI: "KI",
    aus_gesamt: "Ausgaben gesamt", aus_neu: "Neue Ausgabe", aus_eintraege: "Einträge", aus_nach_kat: "Nach Kategorie",
    kommentar_opt: "Kommentar (optional)", heute: "Heute", gestern: "Gestern",
    tag_frueher: "Einen Tag früher", tag_spaeter: "Einen Tag später", keine_eintraege: "Noch keine Einträge.",
    kat_Lebensmittel: "Lebensmittel", "kat_Essen & Trinken": "Essen & Trinken", kat_Tanken: "Tanken",
    kat_Freizeit: "Freizeit", kat_Kleidung: "Kleidung", kat_Zigaretten: "Zigaretten",
    kat_Gesundheit: "Gesundheit", kat_Sonstiges: "Sonstiges",
    bud_gesamt: "Budget gesamt",
    bud_hinweis: 'Tippe auf eine Kategorie und lege dein Budget fest. Es gilt ab dem angezeigten Monat für alle folgenden Monate. Die Ausgaben kommen automatisch aus dem Reiter Ausgaben. Mit <span class="zahl">0</span> entfernst du ein Budget.',
    bud_kein_gesetzt: "Noch kein Budget festgelegt.", kein_budget: "Kein Budget",
    noch_uebrig: "Noch {x} übrig", ueberschritten: "Überschritten um {x}",
    einst_titel: "Einstellungen", einst_waehrung: "Währung",
    einst_waehrung_hinweis: "Es ändert sich nur die Anzeige. Beträge werden nicht umgerechnet.",
    einst_sprache: "Sprache", einst_kategorien: "Kategorien",
    einst_kat_hinweis: "Wähle, welche Kategorien du verwenden willst, oder erstelle unten eigene. Nicht gewählte erscheinen nicht bei Ausgaben und Budget. Bereits eingetragene Ausgaben bleiben erhalten. Mindestens eine Kategorie bleibt immer aktiv.",
    eigene_kat: "Eigene Kategorie", hinzufuegen: "Hinzufügen", kat_doppelt: "Diese Kategorie gibt es schon.", loeschen: "löschen",
    w_EUR: "Euro", w_USD: "US-Dollar", w_GBP: "Britisches Pfund", w_HUF: "Ungarischer Forint",
    w_PLN: "Polnischer Złoty", w_CZK: "Tschechische Krone", w_CHF: "Schweizer Franken",
    einzahlen: "Sparen", auszahlen: "Entnehmen", aria_ea: "Sparen oder Entnehmen",
    rl_verlauf: "Verlauf", rl_start: "Startkapital", rl_keine: "Noch keine Buchungen.", neuer_stand: "neuer Stand"
  },

  en: {
    tippen: "TAP TO OPEN",
    intro_aria: "Open Mint",
    zur_uebersicht: "To overview",
    voriger_monat: "Previous month",
    naechster_monat: "Next month",
    nav_uebersicht: "Overview", nav_einkommen: "Income", nav_fixkosten: "Fixed costs",
    nav_ausgaben: "Expenses", nav_budget: "Budget", nav_ruecklage: "Savings",
    ue_ueberschuss: "Monthly surplus", einnahmen: "Income", ue_ausgaben: "Daily expenses",
    ue_ruecklage: "Total saved",
    betrag_in: "Amount in", bud_in: "Budget in", buchen: "Book",
    ein_gesamt: "Total income", ein_gehalt: "Base salary (net)",
    ein_gilt_ab: "Applies from the month shown to all following months.",
    ein_sonder: "Special payments", bezeichnung: "Description",
    sz_Weihnachtsgeld: "Christmas bonus", sz_Urlaubsgeld: "Holiday pay", sz_Provision: "Commission",
    sz_Steuerausgleich: "Tax refund", sz_Anderes: "Other",
    noch_nichts: "Nothing entered yet.", aktuell: "Current:",
    fix_gesamt: "Total fixed costs",
    fix_hinweis: 'An amount applies from the month shown to all following months. When a cost ends, enter <span class="zahl">0</span>.',
    fix_Miete: "Rent", fix_Strom: "Electricity", fix_Handy: "Mobile phone", fix_Internet: "Internet", fix_Auto: "Car",
    fix_Privatkonkurs: "Personal bankruptcy", fix_Playstation: "Playstation", fix_Gym: "Gym", fix_KI: "AI",
    aus_gesamt: "Total expenses", aus_neu: "New expense", aus_eintraege: "Entries", aus_nach_kat: "By category",
    kommentar_opt: "Comment (optional)", heute: "Today", gestern: "Yesterday",
    tag_frueher: "One day earlier", tag_spaeter: "One day later", keine_eintraege: "No entries yet.",
    kat_Lebensmittel: "Groceries", "kat_Essen & Trinken": "Food & drinks", kat_Tanken: "Fuel",
    kat_Freizeit: "Leisure", kat_Kleidung: "Clothing", kat_Zigaretten: "Cigarettes",
    kat_Gesundheit: "Health", kat_Sonstiges: "Other",
    bud_gesamt: "Total budget",
    bud_hinweis: 'Tap a category and set your budget. It applies from the month shown to all following months. Expenses are taken automatically from the Expenses tab. Enter <span class="zahl">0</span> to remove a budget.',
    bud_kein_gesetzt: "No budget set yet.", kein_budget: "No budget",
    noch_uebrig: "{x} left", ueberschritten: "Over by {x}",
    einst_titel: "Settings", einst_waehrung: "Currency",
    einst_waehrung_hinweis: "Only the display changes. Amounts are not converted.",
    einst_sprache: "Language", einst_kategorien: "Categories",
    einst_kat_hinweis: "Choose which categories you want to use, or create your own below. Unselected ones do not appear in Expenses and Budget. Expenses already entered are kept. At least one category always stays active.",
    eigene_kat: "Own category", hinzufuegen: "Add", kat_doppelt: "This category already exists.", loeschen: "delete",
    w_EUR: "Euro", w_USD: "US dollar", w_GBP: "British pound", w_HUF: "Hungarian forint",
    w_PLN: "Polish złoty", w_CZK: "Czech koruna", w_CHF: "Swiss franc",
    einzahlen: "Save", auszahlen: "Withdraw", aria_ea: "Save or withdraw",
    rl_verlauf: "History", rl_start: "Starting capital", rl_keine: "No bookings yet.", neuer_stand: "new balance"
  },

  it: {
    tippen: "TOCCA PER APRIRE",
    intro_aria: "Apri Mint",
    zur_uebersicht: "Alla panoramica",
    voriger_monat: "Mese precedente",
    naechster_monat: "Mese successivo",
    nav_uebersicht: "Panoramica", nav_einkommen: "Entrate", nav_fixkosten: "Costi fissi",
    nav_ausgaben: "Spese", nav_budget: "Budget", nav_ruecklage: "Risparmi",
    ue_ueberschuss: "Avanzo mensile", einnahmen: "Entrate", ue_ausgaben: "Spese giornaliere",
    ue_ruecklage: "Totale risparmiato",
    betrag_in: "Importo in", bud_in: "Budget in", buchen: "Registra",
    ein_gesamt: "Entrate totali", ein_gehalt: "Stipendio base (netto)",
    ein_gilt_ab: "Vale dal mese mostrato per tutti i mesi successivi.",
    ein_sonder: "Pagamenti speciali", bezeichnung: "Descrizione",
    sz_Weihnachtsgeld: "Tredicesima", sz_Urlaubsgeld: "Indennità di ferie", sz_Provision: "Provvigione",
    sz_Steuerausgleich: "Rimborso fiscale", sz_Anderes: "Altro",
    noch_nichts: "Ancora nulla inserito.", aktuell: "Attuale:",
    fix_gesamt: "Totale costi fissi",
    fix_hinweis: 'Un importo vale dal mese mostrato per tutti i mesi successivi. Se un costo termina, inserisci <span class="zahl">0</span>.',
    fix_Miete: "Affitto", fix_Strom: "Elettricità", fix_Handy: "Cellulare", fix_Internet: "Internet", fix_Auto: "Auto",
    fix_Privatkonkurs: "Fallimento personale", fix_Playstation: "Playstation", fix_Gym: "Palestra", fix_KI: "IA",
    aus_gesamt: "Totale spese", aus_neu: "Nuova spesa", aus_eintraege: "Voci", aus_nach_kat: "Per categoria",
    kommentar_opt: "Commento (facoltativo)", heute: "Oggi", gestern: "Ieri",
    tag_frueher: "Un giorno prima", tag_spaeter: "Un giorno dopo", keine_eintraege: "Nessuna voce.",
    kat_Lebensmittel: "Alimentari", "kat_Essen & Trinken": "Cibo e bevande", kat_Tanken: "Carburante",
    kat_Freizeit: "Tempo libero", kat_Kleidung: "Abbigliamento", kat_Zigaretten: "Sigarette",
    kat_Gesundheit: "Salute", kat_Sonstiges: "Altro",
    bud_gesamt: "Budget totale",
    bud_hinweis: 'Tocca una categoria e imposta il tuo budget. Vale dal mese mostrato per tutti i mesi successivi. Le spese provengono automaticamente dalla scheda Spese. Con <span class="zahl">0</span> rimuovi un budget.',
    bud_kein_gesetzt: "Nessun budget impostato.", kein_budget: "Nessun budget",
    noch_uebrig: "Restano {x}", ueberschritten: "Superato di {x}",
    einst_titel: "Impostazioni", einst_waehrung: "Valuta",
    einst_waehrung_hinweis: "Cambia solo la visualizzazione. Gli importi non vengono convertiti.",
    einst_sprache: "Lingua", einst_kategorien: "Categorie",
    einst_kat_hinweis: "Scegli quali categorie usare o creane di tue qui sotto. Quelle non scelte non compaiono in Spese e Budget. Le spese già inserite restano. Almeno una categoria resta sempre attiva.",
    eigene_kat: "Categoria personale", hinzufuegen: "Aggiungi", kat_doppelt: "Questa categoria esiste già.", loeschen: "elimina",
    w_EUR: "Euro", w_USD: "Dollaro USA", w_GBP: "Sterlina britannica", w_HUF: "Fiorino ungherese",
    w_PLN: "Złoty polacco", w_CZK: "Corona ceca", w_CHF: "Franco svizzero",
    einzahlen: "Risparmia", auszahlen: "Preleva", aria_ea: "Risparmiare o prelevare",
    rl_verlauf: "Cronologia", rl_start: "Capitale iniziale", rl_keine: "Nessuna registrazione.", neuer_stand: "nuovo saldo"
  },

  fr: {
    tippen: "APPUYER POUR OUVRIR",
    intro_aria: "Ouvrir Mint",
    zur_uebersicht: "Vers l'aperçu",
    voriger_monat: "Mois précédent",
    naechster_monat: "Mois suivant",
    nav_uebersicht: "Aperçu", nav_einkommen: "Revenus", nav_fixkosten: "Charges fixes",
    nav_ausgaben: "Dépenses", nav_budget: "Budget", nav_ruecklage: "Épargne",
    ue_ueberschuss: "Excédent mensuel", einnahmen: "Revenus", ue_ausgaben: "Dépenses quotidiennes",
    ue_ruecklage: "Total épargné",
    betrag_in: "Montant en", bud_in: "Budget en", buchen: "Enregistrer",
    ein_gesamt: "Total des revenus", ein_gehalt: "Salaire de base (net)",
    ein_gilt_ab: "Valable à partir du mois affiché pour tous les mois suivants.",
    ein_sonder: "Paiements spéciaux", bezeichnung: "Description",
    sz_Weihnachtsgeld: "Prime de Noël", sz_Urlaubsgeld: "Prime de vacances", sz_Provision: "Commission",
    sz_Steuerausgleich: "Remboursement d'impôt", sz_Anderes: "Autre",
    noch_nichts: "Rien de saisi pour l'instant.", aktuell: "Actuel :",
    fix_gesamt: "Total des charges fixes",
    fix_hinweis: 'Un montant s\'applique à partir du mois affiché pour tous les mois suivants. Quand une charge se termine, saisissez <span class="zahl">0</span>.',
    fix_Miete: "Loyer", fix_Strom: "Électricité", fix_Handy: "Téléphone mobile", fix_Internet: "Internet", fix_Auto: "Voiture",
    fix_Privatkonkurs: "Faillite personnelle", fix_Playstation: "Playstation", fix_Gym: "Salle de sport", fix_KI: "IA",
    aus_gesamt: "Total des dépenses", aus_neu: "Nouvelle dépense", aus_eintraege: "Entrées", aus_nach_kat: "Par catégorie",
    kommentar_opt: "Commentaire (facultatif)", heute: "Aujourd'hui", gestern: "Hier",
    tag_frueher: "Un jour plus tôt", tag_spaeter: "Un jour plus tard", keine_eintraege: "Aucune entrée.",
    kat_Lebensmittel: "Courses", "kat_Essen & Trinken": "Nourriture et boissons", kat_Tanken: "Carburant",
    kat_Freizeit: "Loisirs", kat_Kleidung: "Vêtements", kat_Zigaretten: "Cigarettes",
    kat_Gesundheit: "Santé", kat_Sonstiges: "Divers",
    bud_gesamt: "Budget total",
    bud_hinweis: 'Touchez une catégorie et fixez votre budget. Il s\'applique à partir du mois affiché pour tous les mois suivants. Les dépenses proviennent automatiquement de l\'onglet Dépenses. Saisissez <span class="zahl">0</span> pour supprimer un budget.',
    bud_kein_gesetzt: "Aucun budget défini.", kein_budget: "Aucun budget",
    noch_uebrig: "Il reste {x}", ueberschritten: "Dépassé de {x}",
    einst_titel: "Paramètres", einst_waehrung: "Devise",
    einst_waehrung_hinweis: "Seul l'affichage change. Les montants ne sont pas convertis.",
    einst_sprache: "Langue", einst_kategorien: "Catégories",
    einst_kat_hinweis: "Choisissez les catégories à utiliser ou créez les vôtres ci-dessous. Celles non choisies n'apparaissent pas dans Dépenses et Budget. Les dépenses déjà saisies sont conservées. Au moins une catégorie reste toujours active.",
    eigene_kat: "Catégorie personnalisée", hinzufuegen: "Ajouter", kat_doppelt: "Cette catégorie existe déjà.", loeschen: "supprimer",
    w_EUR: "Euro", w_USD: "Dollar américain", w_GBP: "Livre sterling", w_HUF: "Forint hongrois",
    w_PLN: "Złoty polonais", w_CZK: "Couronne tchèque", w_CHF: "Franc suisse",
    einzahlen: "Épargner", auszahlen: "Retirer", aria_ea: "Épargner ou retirer",
    rl_verlauf: "Historique", rl_start: "Capital de départ", rl_keine: "Aucune écriture.", neuer_stand: "nouveau solde"
  }
};

// Aktuelle Sprache (de, falls noch nichts gewählt ist)
function sprache() {
  const wahl = einstellungen && einstellungen.sprache;
  return SPRACHEN[wahl] ? wahl : "de";
}

// Text zu einem Schlüssel; fehlt er in der Sprache, kommt der deutsche Text
function t(schluessel) {
  const text = TEXTE[sprache()][schluessel];
  return text !== undefined ? text : (TEXTE.de[schluessel] !== undefined ? TEXTE.de[schluessel] : schluessel);
}

// Gespeicherter Name (z. B. Kategorie "Tanken") in der aktuellen Sprache; eigene Namen bleiben wie sie sind
function tName(name, vorsatz) {
  const text = TEXTE[sprache()][vorsatz + name];
  return text !== undefined ? text : name;
}

function monatNameKurz(kalenderMonat) { return MONATE_KURZ[sprache()][kalenderMonat]; }
function wochentagKurz(tag) { return WOCHENTAGE_KURZ[sprache()][tag]; }

// Alle festen Texte in index.html in die gewählte Sprache bringen
function uebersetzeStatisch() {
  document.documentElement.lang = sprache();
  document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  document.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll("[data-i18n-phw]").forEach(function (el) {
    el.placeholder = t(el.dataset.i18nPhw) + " " + waehrungsZeichen();
  });
}

// Einkommensquellen
Object.assign(TEXTE.de, {
  ein_laufend: "Laufendes Einkommen (netto)", ein_quelle: "Einkommensquelle",
  ein_gilt_ab: "Gilt ab dem angezeigten Monat für alle folgenden Monate. Wenn ein Einkommen endet, trage 0 ein.",
  qu_Gehalt: "Gehalt", qu_Nebenjob: "Nebenjob", qu_Pension: "Pension", qu_Kindergeld: "Kindergeld", qu_Mieteinnahmen: "Mieteinnahmen",
  einst_quellen: "Einkommensquellen",
  einst_quellen_hinweis: "Gehalt, Nebenjob, Pension, Kindergeld und Mieteinnahmen gibt es schon. Lege hier eigene Quellen an. Beim Löschen gehen auch ihre Beträge verloren.",
  qu_neu_ph: "Neue Quelle", qu_doppelt: "Diese Quelle gibt es schon.", qu_loeschen_frage: "Diese Quelle mit allen Beträgen löschen?"
});
Object.assign(TEXTE.en, {
  ein_laufend: "Regular income (net)", ein_quelle: "Income source",
  ein_gilt_ab: "Applies from the month shown to all following months. When an income ends, enter 0.",
  qu_Gehalt: "Salary", qu_Nebenjob: "Side job", qu_Pension: "Pension", qu_Kindergeld: "Child benefit", qu_Mieteinnahmen: "Rental income",
  einst_quellen: "Income sources",
  einst_quellen_hinweis: "Salary, side job, pension, child benefit and rental income already exist. Create your own sources here. Deleting a source also deletes its amounts.",
  qu_neu_ph: "New source", qu_doppelt: "This source already exists.", qu_loeschen_frage: "Delete this source with all its amounts?"
});
Object.assign(TEXTE.it, {
  ein_laufend: "Reddito periodico (netto)", ein_quelle: "Fonte di reddito",
  ein_gilt_ab: "Vale dal mese mostrato per tutti i mesi successivi. Se un reddito termina, inserisci 0.",
  qu_Gehalt: "Stipendio", qu_Nebenjob: "Lavoretto", qu_Pension: "Pensione", qu_Kindergeld: "Assegno familiare", qu_Mieteinnahmen: "Affitti incassati",
  einst_quellen: "Fonti di reddito",
  einst_quellen_hinweis: "Stipendio, lavoretto, pensione, assegno familiare e affitti incassati ci sono già. Crea qui le tue fonti. Eliminando una fonte si eliminano anche i suoi importi.",
  qu_neu_ph: "Nuova fonte", qu_doppelt: "Questa fonte esiste già.", qu_loeschen_frage: "Eliminare questa fonte con tutti i suoi importi?"
});
Object.assign(TEXTE.fr, {
  ein_laufend: "Revenus réguliers (net)", ein_quelle: "Source de revenus",
  ein_gilt_ab: "Valable à partir du mois affiché pour tous les mois suivants. Quand un revenu s'arrête, saisissez 0.",
  qu_Gehalt: "Salaire", qu_Nebenjob: "Petit boulot", qu_Pension: "Pension", qu_Kindergeld: "Allocations familiales", qu_Mieteinnahmen: "Revenus locatifs",
  einst_quellen: "Sources de revenus",
  einst_quellen_hinweis: "Salaire, petit boulot, pension, allocations familiales et revenus locatifs existent déjà. Créez ici vos propres sources. Supprimer une source supprime aussi ses montants.",
  qu_neu_ph: "Nouvelle source", qu_doppelt: "Cette source existe déjà.", qu_loeschen_frage: "Supprimer cette source avec tous ses montants ?"
});

// Beschriftung für den Griff, der die weiteren Reiter im Menü aufklappt
TEXTE.de.nav_mehr = "Mehr";
TEXTE.en.nav_mehr = "More";
TEXTE.it.nav_mehr = "Altro";
TEXTE.fr.nav_mehr = "Plus";
TEXTE.de.menue_mehr = "Weitere Reiter";
TEXTE.en.menue_mehr = "More tabs";
TEXTE.it.menue_mehr = "Altre schede";
TEXTE.fr.menue_mehr = "Autres onglets";

// Texte für den Reiter Sparen (früher Rücklage), die Übersicht und die Zahlungen pro Jahr bei Schulden
Object.assign(TEXTE.de, {
  rl_monat: "Diesen Monat gespart", rl_neu: "Neuer Eintrag", ue_sparen: "Sparen", ue_schuldenzahlung: "Schuldenzahlungen",
  sch_pj12: "12 Zahlungen pro Jahr", sch_pj14: "14 Zahlungen pro Jahr"
});
Object.assign(TEXTE.en, {
  rl_monat: "Saved this month", rl_neu: "New entry", ue_sparen: "Saving", ue_schuldenzahlung: "Debt payments",
  sch_pj12: "12 payments per year", sch_pj14: "14 payments per year"
});
Object.assign(TEXTE.it, {
  rl_monat: "Risparmiato questo mese", rl_neu: "Nuova voce", ue_sparen: "Risparmio", ue_schuldenzahlung: "Pagamenti dei debiti",
  sch_pj12: "12 pagamenti all'anno", sch_pj14: "14 pagamenti all'anno"
});
Object.assign(TEXTE.fr, {
  rl_monat: "Épargné ce mois-ci", rl_neu: "Nouvelle entrée", ue_sparen: "Épargne", ue_schuldenzahlung: "Remboursements de dettes",
  sch_pj12: "12 paiements par an", sch_pj14: "14 paiements par an"
});

// Texte für die frei wählbaren Bereiche und die selbst angelegten Fixkosten
Object.assign(TEXTE.de, {
  einst_bereiche: "Bereiche",
  einst_bereiche_hinweis: "Wähle, welche Bereiche du nutzen willst. Übersicht und Einstellungen sind immer da. Nicht gewählte Bereiche erscheinen weder im Menü noch in der Übersicht und zählen nicht mit. Deine Eingaben bleiben gespeichert. Mindestens ein Bereich bleibt aktiv.",
  einst_fix: "Fixkosten",
  einst_fix_hinweis: "Lege hier deine Fixkosten selbst an, z. B. Miete oder Handy. Beim Löschen eines Postens gehen auch seine Beträge verloren.",
  fix_posten_ph: "Neuer Posten", fix_doppelt: "Diesen Posten gibt es schon.", fix_loeschen_frage: "Diesen Posten mit allen Beträgen löschen?",
  fix_leer: "Noch keine Fixkosten angelegt. Lege deine Posten in den Einstellungen unter „Fixkosten“ an.", zu_einst: "Zu den Einstellungen",
  sich_titel: "Sicherung", sich_hinweis: "Deine Daten liegen nur auf diesem Gerät. Speichere sie als Datei, damit sie nicht verloren gehen.",
  sich_sichern: "Sichern", sich_wiederherstellen: "Wiederherstellen",
  sich_frage: "Die aktuellen Daten werden überschrieben. Wirklich wiederherstellen?", sich_fehler: "Diese Datei passt nicht zu Mint."
});
Object.assign(TEXTE.en, {
  einst_bereiche: "Sections",
  einst_bereiche_hinweis: "Choose which sections you want to use. Overview and Settings are always there. Unselected sections do not appear in the menu or the overview and are not counted. Your entries stay saved. At least one section always stays active.",
  einst_fix: "Fixed costs",
  einst_fix_hinweis: "Create your own fixed costs here, e.g. rent or mobile phone. Deleting an item also deletes its amounts.",
  fix_posten_ph: "New item", fix_doppelt: "This item already exists.", fix_loeschen_frage: "Delete this item with all its amounts?",
  fix_leer: "No fixed costs yet. Create your items in Settings under “Fixed costs”.", zu_einst: "Go to settings",
  sich_titel: "Backup", sich_hinweis: "Your data is only stored on this device. Save it as a file so it does not get lost.",
  sich_sichern: "Back up", sich_wiederherstellen: "Restore",
  sich_frage: "The current data will be overwritten. Really restore?", sich_fehler: "This file does not fit Mint."
});
Object.assign(TEXTE.it, {
  einst_bereiche: "Sezioni",
  einst_bereiche_hinweis: "Scegli quali sezioni usare. Panoramica e Impostazioni ci sono sempre. Le sezioni non scelte non compaiono nel menu né nella panoramica e non vengono conteggiate. I tuoi inserimenti restano salvati. Almeno una sezione resta sempre attiva.",
  einst_fix: "Costi fissi",
  einst_fix_hinweis: "Crea qui i tuoi costi fissi, ad esempio affitto o cellulare. Eliminando una voce si eliminano anche i suoi importi.",
  fix_posten_ph: "Nuova voce", fix_doppelt: "Questa voce esiste già.", fix_loeschen_frage: "Eliminare questa voce con tutti i suoi importi?",
  fix_leer: "Nessun costo fisso creato. Crea le tue voci in Impostazioni sotto «Costi fissi».", zu_einst: "Vai alle impostazioni",
  sich_titel: "Backup", sich_hinweis: "I tuoi dati sono solo su questo dispositivo. Salvali in un file per non perderli.",
  sich_sichern: "Salva", sich_wiederherstellen: "Ripristina",
  sich_frage: "I dati attuali verranno sovrascritti. Ripristinare davvero?", sich_fehler: "Questo file non è adatto a Mint."
});
Object.assign(TEXTE.fr, {
  einst_bereiche: "Sections",
  einst_bereiche_hinweis: "Choisissez les sections à utiliser. Aperçu et Paramètres sont toujours là. Les sections non choisies n'apparaissent ni dans le menu ni dans l'aperçu et ne sont pas comptées. Vos saisies restent enregistrées. Au moins une section reste toujours active.",
  einst_fix: "Charges fixes",
  einst_fix_hinweis: "Créez ici vos charges fixes, par exemple le loyer ou le téléphone. Supprimer un poste supprime aussi ses montants.",
  fix_posten_ph: "Nouveau poste", fix_doppelt: "Ce poste existe déjà.", fix_loeschen_frage: "Supprimer ce poste avec tous ses montants ?",
  fix_leer: "Aucune charge fixe créée. Créez vos postes dans Paramètres sous « Charges fixes ».", zu_einst: "Aller aux paramètres",
  sich_titel: "Sauvegarde", sich_hinweis: "Vos données ne sont que sur cet appareil. Enregistrez-les dans un fichier pour ne pas les perdre.",
  sich_sichern: "Sauvegarder", sich_wiederherstellen: "Restaurer",
  sich_frage: "Les données actuelles seront écrasées. Vraiment restaurer ?", sich_fehler: "Ce fichier ne correspond pas à Mint."
});

// Bearbeiten, App-Sperre, Sparziele, Jahresübersicht
Object.assign(TEXTE.de, {
  speichern: "Speichern", abbrechen: "Abbrechen", bearbeiten: "bearbeiten",
  sp_titel: "App-Sperre", sp_hinweis: "Schützt die App mit einer 4-stelligen PIN. Vergisst du die PIN, hilft nur das Löschen der Browser-Daten. Mach deshalb vorher eine Sicherung.",
  sp_an: "Die Sperre ist eingeschaltet.", sp_aus: "Die Sperre ist ausgeschaltet.",
  sp_festlegen: "PIN festlegen", sp_aendern: "PIN ändern", sp_entfernen: "PIN entfernen",
  sp_eingeben: "PIN eingeben", sp_neu: "Neue PIN wählen", sp_wiederholen: "PIN wiederholen",
  sp_falsch: "Falsche PIN", sp_ungleich: "Die PINs sind verschieden. Bitte neu wählen.", sp_ziffer_loeschen: "Ziffer löschen",
  ziel_titel: "Sparziele", ziel_hinweis: "Dein Gespartes füllt die Ziele der Reihe nach.", ziel_name_ph: "Name des Ziels",
  ziel_in: "Zielbetrag in", ziel_keine: "Noch keine Sparziele.", ziel_erreicht: "Erreicht!",
  nav_jahr: "Jahr", jahr_titel: "Jahresübersicht", jahr_ueberschuss: "Überschuss im Jahr", jahr_pro_monat: "Pro Monat"
});
Object.assign(TEXTE.en, {
  speichern: "Save", abbrechen: "Cancel", bearbeiten: "edit",
  sp_titel: "App lock", sp_hinweis: "Protects the app with a 4-digit PIN. If you forget the PIN, the only way out is to clear the browser data, so make a backup first.",
  sp_an: "The lock is on.", sp_aus: "The lock is off.",
  sp_festlegen: "Set PIN", sp_aendern: "Change PIN", sp_entfernen: "Remove PIN",
  sp_eingeben: "Enter PIN", sp_neu: "Choose a new PIN", sp_wiederholen: "Repeat PIN",
  sp_falsch: "Wrong PIN", sp_ungleich: "The PINs do not match. Please choose again.", sp_ziffer_loeschen: "Delete digit",
  ziel_titel: "Savings goals", ziel_hinweis: "Your savings fill the goals in order.", ziel_name_ph: "Name of the goal",
  ziel_in: "Target amount in", ziel_keine: "No savings goals yet.", ziel_erreicht: "Reached!",
  nav_jahr: "Year", jahr_titel: "Yearly overview", jahr_ueberschuss: "Surplus for the year", jahr_pro_monat: "Per month"
});
Object.assign(TEXTE.it, {
  speichern: "Salva", abbrechen: "Annulla", bearbeiten: "modifica",
  sp_titel: "Blocco app", sp_hinweis: "Protegge l'app con un PIN di 4 cifre. Se dimentichi il PIN, resta solo la cancellazione dei dati del browser. Fai prima un backup.",
  sp_an: "Il blocco è attivo.", sp_aus: "Il blocco è disattivato.",
  sp_festlegen: "Imposta PIN", sp_aendern: "Cambia PIN", sp_entfernen: "Rimuovi PIN",
  sp_eingeben: "Inserisci il PIN", sp_neu: "Scegli un nuovo PIN", sp_wiederholen: "Ripeti il PIN",
  sp_falsch: "PIN errato", sp_ungleich: "I PIN non coincidono. Scegli di nuovo.", sp_ziffer_loeschen: "Cancella cifra",
  ziel_titel: "Obiettivi di risparmio", ziel_hinweis: "I tuoi risparmi riempiono gli obiettivi in ordine.", ziel_name_ph: "Nome dell'obiettivo",
  ziel_in: "Importo obiettivo in", ziel_keine: "Ancora nessun obiettivo.", ziel_erreicht: "Raggiunto!",
  nav_jahr: "Anno", jahr_titel: "Panoramica annuale", jahr_ueberschuss: "Avanzo dell'anno", jahr_pro_monat: "Per mese"
});
Object.assign(TEXTE.fr, {
  speichern: "Enregistrer", abbrechen: "Annuler", bearbeiten: "modifier",
  sp_titel: "Verrouillage", sp_hinweis: "Protège l'application avec un code PIN à 4 chiffres. Si vous oubliez le code, seule la suppression des données du navigateur aide. Faites d'abord une sauvegarde.",
  sp_an: "Le verrouillage est activé.", sp_aus: "Le verrouillage est désactivé.",
  sp_festlegen: "Définir le PIN", sp_aendern: "Changer le PIN", sp_entfernen: "Supprimer le PIN",
  sp_eingeben: "Saisir le PIN", sp_neu: "Choisir un nouveau PIN", sp_wiederholen: "Répéter le PIN",
  sp_falsch: "PIN incorrect", sp_ungleich: "Les codes PIN ne correspondent pas. Choisissez à nouveau.", sp_ziffer_loeschen: "Effacer un chiffre",
  ziel_titel: "Objectifs d'épargne", ziel_hinweis: "Votre épargne remplit les objectifs dans l'ordre.", ziel_name_ph: "Nom de l'objectif",
  ziel_in: "Montant cible en", ziel_keine: "Aucun objectif pour l'instant.", ziel_erreicht: "Atteint !",
  nav_jahr: "Année", jahr_titel: "Aperçu annuel", jahr_ueberschuss: "Excédent de l'année", jahr_pro_monat: "Par mois"
});
