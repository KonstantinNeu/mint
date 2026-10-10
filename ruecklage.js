// Modul Sparen (früher Rücklage): Startkapital und monatliche Spar-Einträge
// Nutzt geld(), zuZahl(), monatText() aus einkommen.js sowie isoZuDatum(), datumZuIso(), kurzDatum(),
// monatNummer(), MAX_TAGE_ZURUECK aus ausgaben.js.
// Die Dateinamen und Namen im Code beginnen noch mit "rl" (Rücklage), angezeigt wird überall "Sparen".

const RL_SPEICHER_NAME = "finanzapp-ruecklage";

// Eintrag: { datum: "2026-10-09", betrag: 100, kommentar: "" }  (Sparen = positiv, Entnehmen = negativ)
let rlDaten = { start: null, buchungen: [] };
let rlMonat = 0;        // 0 = Oktober 2026 ... 11 = September 2027
let rlTageZurueck = 0;  // Datum des neuen Eintrags: 0 = heute, bis zu 7 Tage zurück
let rlVorzeichen = 1;   // 1 = Sparen, -1 = Entnehmen

try {
  const gespeichert = localStorage.getItem(RL_SPEICHER_NAME);
  if (gespeichert) rlDaten = JSON.parse(gespeichert);
} catch (fehler) { /* ohne Speicher weiterarbeiten */ }

// Startmonat: der aktuelle Monat, falls er im Zeitraum liegt
if (monatNummer(new Date()) >= 0) rlMonat = monatNummer(new Date());

function rlSpeichern() {
  try { localStorage.setItem(RL_SPEICHER_NAME, JSON.stringify(rlDaten)); } catch (fehler) { }
}

// Gesamt gespart (Startkapital plus alle Einträge); null, wenn noch nichts eingetragen ist
function rlStand() {
  if (rlDaten.start === null && rlDaten.buchungen.length === 0) return null;
  let stand = rlDaten.start || 0;
  rlDaten.buchungen.forEach(function (b) { stand += b.betrag; });
  return stand;
}

// Im Monat gespart (Sparen minus Entnehmen); null, wenn es für den Monat keinen Eintrag gibt
function sparenSumme(i) {
  let summe = 0;
  let anzahl = 0;
  rlDaten.buchungen.forEach(function (b) {
    if (monatNummer(isoZuDatum(b.datum)) === i) { summe += b.betrag; anzahl++; }
  });
  return anzahl === 0 ? null : summe;
}

function rlGewaehltesDatum() {
  const d = new Date();
  d.setDate(d.getDate() - rlTageZurueck);
  return d;
}

function rlDatumAnzeigen() {
  let text = kurzDatum(rlGewaehltesDatum());
  if (rlTageZurueck === 0) text = t("heute") + " (" + text + ")";
  if (rlTageZurueck === 1) text = t("gestern") + " (" + text + ")";
  document.getElementById("rl-datum-text").textContent = text;
  document.getElementById("rl-tag-zurueck").disabled = rlTageZurueck === MAX_TAGE_ZURUECK;
  document.getElementById("rl-tag-vor").disabled = rlTageZurueck === 0;
}

function rlAnzeigen() {
  document.getElementById("rl-monat-name").textContent = monatText(rlMonat);
  document.getElementById("rl-zurueck").disabled = rlMonat === 0;
  document.getElementById("rl-vor").disabled = rlMonat === 11;

  const startFeld = document.getElementById("rl-start-aktuell");
  startFeld.textContent = rlDaten.start === null ? t("noch_nichts") : t("aktuell") + " " + geld(rlDaten.start);

  const stand = rlStand();
  document.getElementById("rl-stand").textContent = stand === null ? "–" : geld(stand);
  if (typeof zielAnzeigen === "function") zielAnzeigen(); // Sparziele (sparziele.js) neu füllen

  // Einträge dieses Monats, die neuesten zuerst
  const eintraege = rlDaten.buchungen.filter(function (b) {
    return monatNummer(isoZuDatum(b.datum)) === rlMonat;
  });
  eintraege.reverse();
  eintraege.sort(function (a, b) { return a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0; });

  const monatsSumme = sparenSumme(rlMonat);
  const summeFeld = document.getElementById("rl-monat-summe");
  summeFeld.textContent = monatsSumme === null ? "–" : geld(monatsSumme);
  summeFeld.className = monatsSumme === null ? "" : monatsSumme < 0 ? "ausgabe" : "einnahme";

  document.getElementById("rl-anzahl").textContent = eintraege.length === 0 ? "" : "(" + eintraege.length + ")";

  const liste = document.getElementById("rl-liste");
  liste.innerHTML = "";
  if (eintraege.length === 0) {
    const leer = document.createElement("li");
    leer.className = "hinweis";
    leer.textContent = t("keine_eintraege");
    liste.append(leer);
  }

  eintraege.forEach(function (b) {
    const li = document.createElement("li");

    const info = document.createElement("span");
    info.className = "eintrag-info";
    const titel = document.createElement("span");
    titel.textContent = t(b.betrag < 0 ? "auszahlen" : "einzahlen");
    const klein = document.createElement("small");
    klein.textContent = kurzDatum(isoZuDatum(b.datum)) + (b.kommentar ? " · " + b.kommentar : "");
    info.append(titel, klein);

    const betrag = document.createElement("span");
    betrag.className = b.betrag < 0 ? "ausgabe" : "einnahme";
    betrag.textContent = (b.betrag < 0 ? "− " : "+ ") + geld(Math.abs(b.betrag));

    const loeschen = document.createElement("button");
    loeschen.textContent = "×";
    loeschen.setAttribute("aria-label", t("loeschen"));
    loeschen.addEventListener("click", function () {
      rlDaten.buchungen = rlDaten.buchungen.filter(function (x) { return x !== b; });
      rlSpeichern();
      rlAnzeigen();
    });

    const bearbeiten = bearbeitenKnopf(function () {
      eintragBearbeiten(li, kurzDatum(isoZuDatum(b.datum)), [
        { typ: "betrag", wert: Math.abs(b.betrag) },
        { typ: "auswahl", wert: b.betrag < 0 ? "-1" : "1", optionen: [{ wert: "1", text: t("einzahlen") }, { wert: "-1", text: t("auszahlen") }] },
        { typ: "text", wert: b.kommentar, platzhalter: t("kommentar_opt") }
      ], function (werte) {
        const neu = zuZahl(werte[0]);
        if (neu === null || neu <= 0) return false;
        b.betrag = Number(werte[1]) * neu;
        b.kommentar = werte[2].trim();
        rlSpeichern();
        rlAnzeigen();
      }, rlAnzeigen);
    });

    li.append(info, betrag, bearbeiten, loeschen);
    liste.append(li);
  });
}

// Neuen Eintrag buchen
function rlBuchen(vorzeichen) {
  const eingabe = document.getElementById("rl-betrag");
  const betrag = zuZahl(eingabe.value);
  if (betrag === null || betrag <= 0) return;
  const datum = rlGewaehltesDatum();
  rlDaten.buchungen.push({
    datum: datumZuIso(datum),
    betrag: vorzeichen * betrag,
    kommentar: document.getElementById("rl-kommentar").value.trim()
  });
  rlSpeichern();

  // Zum Monat des neuen Eintrags springen, damit man ihn sieht
  if (monatNummer(datum) >= 0) rlMonat = monatNummer(datum);

  eingabe.value = "";
  document.getElementById("rl-kommentar").value = "";
  rlTageZurueck = 0;
  document.getElementById("rl-datum-zeile").hidden = true;
  rlAnzeigen();
}

// Umschalter: Sparen (+) oder Entnehmen (−), gebucht wird mit dem Knopf "Buchen"
function rlModusSetzen(vorzeichen) {
  rlVorzeichen = vorzeichen;
  document.getElementById("rl-ein").classList.toggle("aktiv", vorzeichen === 1);
  document.getElementById("rl-aus").classList.toggle("aktiv", vorzeichen === -1);
}

document.getElementById("rl-ein").addEventListener("click", function () { rlModusSetzen(1); });
document.getElementById("rl-aus").addEventListener("click", function () { rlModusSetzen(-1); });
document.getElementById("rl-form").addEventListener("submit", function (e) {
  e.preventDefault();
  rlBuchen(rlVorzeichen);
});

// Die Datumszeile erscheint erst, wenn ein Betrag eingegeben ist
document.getElementById("rl-betrag").addEventListener("input", function (e) {
  const zeile = document.getElementById("rl-datum-zeile");
  zeile.hidden = e.target.value.trim() === "";
  if (!zeile.hidden) rlDatumAnzeigen();
});

document.getElementById("rl-tag-zurueck").addEventListener("click", function () {
  if (rlTageZurueck < MAX_TAGE_ZURUECK) { rlTageZurueck++; rlDatumAnzeigen(); }
});
document.getElementById("rl-tag-vor").addEventListener("click", function () {
  if (rlTageZurueck > 0) { rlTageZurueck--; rlDatumAnzeigen(); }
});

document.getElementById("rl-zurueck").addEventListener("click", function () {
  if (rlMonat > 0) { rlMonat--; rlAnzeigen(); }
});
document.getElementById("rl-vor").addEventListener("click", function () {
  if (rlMonat < 11) { rlMonat++; rlAnzeigen(); }
});

// Startkapital
document.getElementById("rl-start-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const betrag = zuZahl(document.getElementById("rl-start-betrag").value);
  if (betrag === null || betrag < 0) return;
  rlDaten.start = betrag;
  e.target.reset();
  rlSpeichern();
  rlAnzeigen();
});

rlAnzeigen();
