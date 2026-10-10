// Modul Tägliche Ausgaben: Betrag, Kategorie, Datum (bis 7 Tage zurück), Kommentar
// Nutzt geld(), zuZahl(), monatText() aus einkommen.js sowie AUS_KATEGORIEN und aktiveKategorien() aus einstellungen.js.

const AUS_SPEICHER_NAME = "finanzapp-ausgaben";
const MAX_TAGE_ZURUECK = 7;

let ausDaten = []; // z. B. [{ datum: "2026-10-09", kategorie: "Tanken", betrag: 55.5, kommentar: "" }]
let ausMonat = 0;  // 0 = Oktober 2026 ... 11 = September 2027
let tageZurueck = 0;

try {
  const gespeichert = localStorage.getItem(AUS_SPEICHER_NAME);
  if (gespeichert) ausDaten = JSON.parse(gespeichert);
} catch (fehler) { /* ohne Speicher weiterarbeiten */ }

function ausSpeichern() {
  try { localStorage.setItem(AUS_SPEICHER_NAME, JSON.stringify(ausDaten)); } catch (fehler) { }
}

// "2026-10-09" -> Datum
function isoZuDatum(iso) {
  const teile = iso.split("-");
  return new Date(Number(teile[0]), Number(teile[1]) - 1, Number(teile[2]));
}

function datumZuIso(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

// Monatsnummer im Zeitraum (0 = Okt 2026), außerhalb: -1
function monatNummer(d) {
  const nr = (d.getFullYear() - 2026) * 12 + d.getMonth() - 9;
  return nr >= 0 && nr <= 11 ? nr : -1;
}

function kurzDatum(d) {
  // Deutsch mit Punkt ("Fr 09. Okt"), die anderen Sprachen ohne ("Fri 09 Oct")
  return wochentagKurz(d.getDay()) + " " + String(d.getDate()).padStart(2, "0") + (sprache() === "de" ? "." : "") + " " + monatNameKurz(d.getMonth());
}

function gewaehltesDatum() {
  const d = new Date();
  d.setDate(d.getDate() - tageZurueck);
  return d;
}

function datumAnzeigen() {
  let text = kurzDatum(gewaehltesDatum());
  if (tageZurueck === 0) text = t("heute") + " (" + text + ")";
  if (tageZurueck === 1) text = t("gestern") + " (" + text + ")";
  document.getElementById("aus-datum-text").textContent = text;
  document.getElementById("aus-tag-zurueck").disabled = tageZurueck === MAX_TAGE_ZURUECK;
  document.getElementById("aus-tag-vor").disabled = tageZurueck === 0;
}

// Ausgaben-Summe eines Monats; null, wenn für den Monat nichts eingetragen ist
function ausSumme(i) {
  let summe = 0;
  let anzahl = 0;
  ausDaten.forEach(function (e) {
    if (monatNummer(isoZuDatum(e.datum)) === i) { summe += e.betrag; anzahl++; }
  });
  return anzahl === 0 ? null : summe;
}

function ausAnzeigen() {
  document.getElementById("aus-monat-name").textContent = monatText(ausMonat);
  document.getElementById("aus-zurueck").disabled = ausMonat === 0;
  document.getElementById("aus-vor").disabled = ausMonat === 11;

  const eintraege = ausDaten.filter(function (e) {
    return monatNummer(isoZuDatum(e.datum)) === ausMonat;
  });
  // neueste zuerst (bei gleichem Datum der zuletzt eingetragene)
  eintraege.reverse();
  eintraege.sort(function (a, b) { return a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0; });

  const liste = document.getElementById("aus-liste");
  liste.innerHTML = "";
  if (eintraege.length === 0) {
    const leer = document.createElement("li");
    leer.className = "hinweis";
    leer.textContent = t("keine_eintraege");
    liste.append(leer);
  }

  let summe = 0;
  const proKategorie = {};

  eintraege.forEach(function (e) {
    summe += e.betrag;
    proKategorie[e.kategorie] = (proKategorie[e.kategorie] || 0) + e.betrag;

    const li = document.createElement("li");

    const info = document.createElement("span");
    info.className = "eintrag-info";
    const titel = document.createElement("span");
    titel.textContent = tName(e.kategorie, "kat_");
    const klein = document.createElement("small");
    klein.textContent = kurzDatum(isoZuDatum(e.datum)) + (e.kommentar ? " · " + e.kommentar : "");
    info.append(titel, klein);

    const betrag = document.createElement("span");
    betrag.className = "ausgabe";
    betrag.textContent = geld(e.betrag);

    const loeschen = document.createElement("button");
    loeschen.textContent = "×";
    loeschen.setAttribute("aria-label", t("loeschen"));
    loeschen.addEventListener("click", function () {
      ausDaten = ausDaten.filter(function (x) { return x !== e; });
      ausSpeichern();
      ausAnzeigen();
    });

    const bearbeiten = bearbeitenKnopf(function () {
      // Auch eine inzwischen abgewählte Kategorie bleibt für diesen Eintrag wählbar
      const kategorien = aktiveKategorien();
      if (kategorien.indexOf(e.kategorie) === -1) kategorien.push(e.kategorie);
      eintragBearbeiten(li, kurzDatum(isoZuDatum(e.datum)), [
        { typ: "betrag", wert: e.betrag },
        { typ: "auswahl", wert: e.kategorie, optionen: kategorien.map(function (k) { return { wert: k, text: tName(k, "kat_") }; }) },
        { typ: "text", wert: e.kommentar, platzhalter: t("kommentar_opt") }
      ], function (werte) {
        const neu = zuZahl(werte[0]);
        if (neu === null || neu <= 0) return false;
        e.betrag = neu;
        e.kategorie = werte[1];
        e.kommentar = werte[2].trim();
        ausSpeichern();
        ausAnzeigen();
      }, ausAnzeigen);
    });

    li.append(info, betrag, bearbeiten, loeschen);
    liste.append(li);
  });

  document.getElementById("aus-anzahl").textContent = eintraege.length === 0 ? "" : "(" + eintraege.length + ")";

  // Summen pro Kategorie (nur Kategorien mit Ausgaben)
  const katListe = document.getElementById("aus-kategorien-summen");
  katListe.innerHTML = "";
  // auch Kategorien, die es nicht mehr gibt (z. B. gelöschte eigene), solange es Ausgaben dafür gibt
  const fehlende = Object.keys(proKategorie).filter(function (k) { return alleKategorien().indexOf(k) === -1; });
  alleKategorien().concat(fehlende).forEach(function (name) {
    if (proKategorie[name] === undefined) return;
    const li = document.createElement("li");
    const n = document.createElement("span");
    n.textContent = tName(name, "kat_");
    const b = document.createElement("span");
    b.className = "ausgabe";
    b.textContent = geld(proKategorie[name]);
    li.append(n, b);
    katListe.append(li);
  });
  if (katListe.children.length === 0) {
    const leer = document.createElement("li");
    leer.className = "hinweis";
    leer.textContent = "–";
    katListe.append(leer);
  }

  // Monate ohne Einträge bleiben leer (kein 0,00 €)
  document.getElementById("aus-summe").textContent = eintraege.length === 0 ? "–" : geld(summe);
}

// Kategorie-Auswahl füllen
const kategorieAuswahl = document.getElementById("aus-kategorie");

// Es erscheinen nur die Kategorien, die in den Einstellungen gewählt sind
function kategorienFuellen() {
  const bisher = kategorieAuswahl.value;
  kategorieAuswahl.innerHTML = "";
  aktiveKategorien().forEach(function (name) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = tName(name, "kat_");
    kategorieAuswahl.append(option);
  });
  if (aktiveKategorien().indexOf(bisher) !== -1) kategorieAuswahl.value = bisher;
}

kategorienFuellen();

// Startmonat: der aktuelle Monat, falls er im Zeitraum liegt
const startMonat = monatNummer(new Date());
if (startMonat >= 0) ausMonat = startMonat;

document.getElementById("aus-zurueck").addEventListener("click", function () {
  if (ausMonat > 0) { ausMonat--; ausAnzeigen(); }
});
document.getElementById("aus-vor").addEventListener("click", function () {
  if (ausMonat < 11) { ausMonat++; ausAnzeigen(); }
});

// Datumszeile erscheint erst, wenn ein Betrag eingegeben ist
document.getElementById("aus-betrag").addEventListener("input", function (e) {
  const zeile = document.getElementById("aus-datum-zeile");
  zeile.hidden = e.target.value.trim() === "";
  if (!zeile.hidden) datumAnzeigen();
});

document.getElementById("aus-tag-zurueck").addEventListener("click", function () {
  if (tageZurueck < MAX_TAGE_ZURUECK) { tageZurueck++; datumAnzeigen(); }
});
document.getElementById("aus-tag-vor").addEventListener("click", function () {
  if (tageZurueck > 0) { tageZurueck--; datumAnzeigen(); }
});

document.getElementById("aus-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const betrag = zuZahl(document.getElementById("aus-betrag").value);
  if (betrag === null || betrag <= 0) return;

  const datum = gewaehltesDatum();
  ausDaten.push({
    datum: datumZuIso(datum),
    kategorie: kategorieAuswahl.value,
    betrag: betrag,
    kommentar: document.getElementById("aus-kommentar").value.trim()
  });
  ausSpeichern();

  // Zum Monat des neuen Eintrags springen, damit man ihn sieht
  if (monatNummer(datum) >= 0) ausMonat = monatNummer(datum);

  e.target.reset();
  tageZurueck = 0;
  document.getElementById("aus-datum-zeile").hidden = true;
  ausAnzeigen();
});

ausAnzeigen();
