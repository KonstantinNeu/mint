// Modul Einkommen: laufende Einkommensquellen (Gehalt, Nebenjob, eigene ...) und Sonderzahlungen (inklusive Provision)
// Die Daten bleiben nur auf diesem Gerät (localStorage).

const SPEICHER_NAME = "finanzapp-einkommen";

// Feste Einkommensquellen; eigene stehen in daten.eigene
const QUELLEN_STANDARD = ["Gehalt", "Nebenjob", "Pension", "Kindergeld", "Mieteinnahmen"];
const QUELLE_ANDERES = "__anderes"; // Auswahl "Anderes": neue eigene Quelle mit Bezeichnung

let daten = { quellen: [], eigene: [], sonder: [] };
let monat = 0; // 0 = Oktober 2026 ... 11 = September 2027

try {
  const gespeichert = localStorage.getItem(SPEICHER_NAME);
  if (gespeichert) daten = JSON.parse(gespeichert);
} catch (fehler) { /* ohne Speicher weiterarbeiten */ }

// Früher gab es nur ein Grundgehalt: alte Einträge werden zur Quelle "Gehalt"
if (!daten.quellen) daten.quellen = [];
if (!daten.eigene) daten.eigene = [];
if (!daten.sonder) daten.sonder = [];
if (daten.gehalt) {
  daten.gehalt.forEach(function (g) {
    daten.quellen.push({ name: "Gehalt", ab: g.ab, betrag: g.betrag });
  });
  delete daten.gehalt;
  speichern();
}

// Früher gab es eine eigene Provision: alte Einträge werden zu Sonderzahlungen "Provision"
if (daten.provision) {
  Object.keys(daten.provision).forEach(function (m) {
    daten.sonder.push({ monat: Number(m), name: "Provision", betrag: daten.provision[m] });
  });
  delete daten.provision;
  speichern();
}

function speichern() {
  try { localStorage.setItem(SPEICHER_NAME, JSON.stringify(daten)); } catch (fehler) { }
}

// Betrag in der gewählten Sprache und Währung: de/it/fr "1.234,56 €", en "€1,234.56"
function geld(zahl) {
  const zeichen = waehrungsZeichen();
  const zahlText = Math.abs(zahl).toLocaleString(SPRACHEN[sprache()].locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const minus = zahl < 0 ? "−" : "";
  if (sprache() === "en") return minus + zeichen + (zeichen.length > 1 ? "\u00a0" : "") + zahlText;
  return minus + zahlText + "\u00a0" + zeichen;
}

// Getippten Betrag lesen: "1.234,56", "1,234.56" oder "1234.56" -> 1234.56
// Steht beides drin, ist das Zeichen ganz rechts das Dezimalzeichen.
function zuZahl(text) {
  let s = text.replace(/\s|€|\$|£|CHF|Ft|zł|Kč/g, "");
  const komma = s.lastIndexOf(",");
  const punkt = s.lastIndexOf(".");
  if (komma !== -1 && punkt !== -1) {
    s = komma > punkt ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  } else if (komma !== -1) {
    s = s.replace(",", ".");
  }
  const zahl = parseFloat(s);
  return isNaN(zahl) ? null : zahl;
}

// Monat im Zeitraum (0 = Oktober 2026 ... 11 = September 2027) als Text, z. B. "Okt 2026" / "Oct 2026"
function monatText(i) {
  const jahr = i < 3 ? 2026 : 2027;
  return monatNameKurz((9 + i) % 12) + " " + jahr;
}

// Bearbeiten-Knopf (Stift) für eine Listenzeile
function bearbeitenKnopf(beiKlick) {
  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.textContent = "✎";
  knopf.setAttribute("aria-label", t("bearbeiten"));
  knopf.addEventListener("click", beiKlick);
  return knopf;
}

// Ersetzt eine Listenzeile durch Eingabefelder zum Ändern eines Eintrags.
// felder: { typ: "betrag" | "text" | "auswahl", wert, optionen: [{ wert, text }] (nur Auswahl), platzhalter }
// beiSpeichern(werte) bekommt die Eingaben als Liste von Texten und gibt false zurück, wenn etwas nicht stimmt.
// beiAbbruch() zeichnet die Liste wieder normal.
function eintragBearbeiten(li, titel, felder, beiSpeichern, beiAbbruch) {
  li.innerHTML = "";
  li.classList.add("bearbeiten");
  const form = document.createElement("form");
  form.className = "bearbeiten-form";

  const ueberschrift = document.createElement("strong");
  ueberschrift.textContent = titel;
  form.append(ueberschrift);

  const elemente = felder.map(function (f) {
    let el;
    if (f.typ === "auswahl") {
      el = document.createElement("select");
      el.className = "auswahl";
      f.optionen.forEach(function (o) {
        const option = document.createElement("option");
        option.value = o.wert;
        option.textContent = o.text;
        el.append(option);
      });
      el.value = f.wert;
    } else {
      el = document.createElement("input");
      el.type = "text";
      el.autocomplete = "off";
      if (f.typ === "betrag") {
        el.setAttribute("inputmode", "decimal");
        el.required = true;
        el.placeholder = t("betrag_in") + " " + waehrungsZeichen();
        el.value = sprache() === "en" ? String(f.wert) : String(f.wert).replace(".", ",");
      } else {
        el.placeholder = f.platzhalter || "";
        el.value = f.wert || "";
      }
    }
    form.append(el);
    return el;
  });

  const zeile = document.createElement("div");
  zeile.className = "zeile";
  const speichern = document.createElement("button");
  speichern.type = "submit";
  speichern.textContent = t("speichern");
  const abbrechen = document.createElement("button");
  abbrechen.type = "button";
  abbrechen.className = "abbrechen";
  abbrechen.textContent = t("abbrechen");
  abbrechen.addEventListener("click", beiAbbruch);
  zeile.append(speichern, abbrechen);
  form.append(zeile);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    beiSpeichern(elemente.map(function (el) { return el.value; }));
  });
  li.append(form);
  elemente[0].focus();
}

// Betrag einer Einkommensquelle im Monat: der letzte Eintrag, der ab diesem Monat oder früher gilt
function quelleFuer(name, i) {
  let treffer = null;
  daten.quellen.forEach(function (q) {
    if (q.name === name && q.ab <= i && (treffer === null || q.ab >= treffer.ab)) treffer = q;
  });
  return treffer ? treffer.betrag : null;
}

// Alle Quellen: die festen plus die eigenen
function alleQuellen() {
  return QUELLEN_STANDARD.concat(daten.eigene);
}

// Einnahmen-Summe eines Monats; null, wenn für den Monat nichts eingetragen ist
function einkommenSumme(i) {
  const sonderListe = daten.sonder.filter(function (s) { return s.monat === i; });
  let summe = 0;
  let hatEintrag = sonderListe.length > 0;
  alleQuellen().forEach(function (name) {
    const betrag = quelleFuer(name, i);
    if (betrag !== null) { summe += betrag; hatEintrag = true; }
  });
  sonderListe.forEach(function (s) { summe += s.betrag; });
  return hatEintrag ? summe : null;
}

// Auswahl der Quelle füllen (feste und eigene), die Wahl bleibt erhalten
function quellenFuellen() {
  const auswahl = document.getElementById("quelle-art");
  const alt = auswahl.value;
  auswahl.innerHTML = "";
  alleQuellen().forEach(function (name) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = tName(name, "qu_");
    auswahl.append(option);
  });
  const anderes = document.createElement("option");
  anderes.value = QUELLE_ANDERES;
  anderes.textContent = t("sz_Anderes");
  auswahl.append(anderes);
  if (alleQuellen().indexOf(alt) !== -1 || alt === QUELLE_ANDERES) auswahl.value = alt;
}

// Neuen Betrag einer Quelle ab dem angezeigten Monat speichern (ersetzt einen Eintrag desselben Monats)
function quelleSetzen(name, betrag) {
  daten.quellen = daten.quellen.filter(function (q) { return !(q.name === name && q.ab === monat); });
  daten.quellen.push({ name: name, ab: monat, betrag: betrag });
  speichern();
  anzeigen();
}

function anzeigen() {
  document.getElementById("monat-name").textContent = monatText(monat);
  document.getElementById("monat-zurueck").disabled = monat === 0;
  document.getElementById("monat-vor").disabled = monat === 11;

  quellenFuellen();
  const sonderListe = daten.sonder.filter(function (s) { return s.monat === monat; });

  // Quellen, die in diesem Monat laufen (Betrag 0 = beendet)
  const quellenListe = document.getElementById("quellen-liste");
  quellenListe.innerHTML = "";
  alleQuellen().forEach(function (name) {
    const betrag = quelleFuer(name, monat);
    if (!betrag) return;
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = tName(name, "qu_");
    const summe = document.createElement("span");
    summe.className = "einnahme";
    summe.textContent = geld(betrag);
    const bearbeiten = bearbeitenKnopf(function () {
      eintragBearbeiten(li, tName(name, "qu_"), [{ typ: "betrag", wert: betrag }], function (werte) {
        const neu = zuZahl(werte[0]);
        if (neu === null || neu < 0) return false;
        quelleSetzen(name, neu);
      }, anzeigen);
    });
    li.append(text, summe, bearbeiten);
    quellenListe.append(li);
  });
  document.getElementById("quellen-leer").hidden = quellenListe.children.length > 0;

  const liste = document.getElementById("sonder-liste");
  liste.innerHTML = "";
  sonderListe.forEach(function (s) {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = tName(s.name, "sz_");
    const betrag = document.createElement("span");
    betrag.className = "einnahme";
    betrag.textContent = geld(s.betrag);
    const loeschen = document.createElement("button");
    loeschen.textContent = "×";
    loeschen.setAttribute("aria-label", t("loeschen"));
    loeschen.addEventListener("click", function () {
      daten.sonder = daten.sonder.filter(function (x) { return x !== s; });
      speichern();
      anzeigen();
    });
    const bearbeiten = bearbeitenKnopf(function () {
      eintragBearbeiten(li, tName(s.name, "sz_"), [{ typ: "betrag", wert: s.betrag }], function (werte) {
        const neu = zuZahl(werte[0]);
        if (neu === null || neu <= 0) return false;
        s.betrag = neu;
        speichern();
        anzeigen();
      }, anzeigen);
    });
    li.append(name, betrag, bearbeiten, loeschen);
    liste.append(li);
  });

  // Monate ohne Einträge bleiben leer (kein 0,00 €)
  const gesamt = einkommenSumme(monat);
  document.getElementById("ein-summe").textContent = gesamt === null ? "–" : geld(gesamt);

  quellenEinstellungenZeichnen();
}

document.getElementById("monat-zurueck").addEventListener("click", function () {
  if (monat > 0) { monat--; anzeigen(); }
});
document.getElementById("monat-vor").addEventListener("click", function () {
  if (monat < 11) { monat++; anzeigen(); }
});

document.getElementById("gehalt-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const betrag = zuZahl(document.getElementById("gehalt-betrag").value);
  if (betrag === null || betrag < 0) return;
  const auswahl = document.getElementById("quelle-art");
  const nameFeld = document.getElementById("quelle-name");
  let name = auswahl.value;
  if (name === QUELLE_ANDERES) {
    name = nameFeld.value.trim().slice(0, 30);
    if (name === "") return;
    if (quelleVorhanden(name)) { nameFeld.setCustomValidity(t("qu_doppelt")); nameFeld.reportValidity(); nameFeld.setCustomValidity(""); return; }
    daten.eigene.push(name);
    quellenFuellen();
    auswahl.value = name;
  }
  document.getElementById("gehalt-betrag").value = "";
  nameFeld.value = "";
  nameFeld.hidden = true;
  nameFeld.required = false;
  quelleSetzen(name, betrag);
});

// Bei "Anderes" erscheint ein Textfeld für die Bezeichnung
document.getElementById("quelle-art").addEventListener("change", function () {
  const anderes = this.value === QUELLE_ANDERES;
  const nameFeld = document.getElementById("quelle-name");
  nameFeld.hidden = !anderes;
  nameFeld.required = anderes;
});

// Gibt es den Namen schon (fest oder eigen, auch übersetzt)?
function quelleVorhanden(name) {
  return alleQuellen().some(function (n) {
    return n.toLowerCase() === name.toLowerCase() || tName(n, "qu_").toLowerCase() === name.toLowerCase();
  });
}

// Einstellungen: bereits angelegte Punkte einzeln löschen (wie bei den Fixkosten)
function einstellungenListe(listeId, namen, vorsatz, frage, loeschenFunktion) {
  const liste = document.getElementById(listeId);
  liste.innerHTML = "";
  namen.forEach(function (name) {
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = tName(name, vorsatz);
    const loeschen = document.createElement("button");
    loeschen.type = "button";
    loeschen.textContent = "×";
    loeschen.setAttribute("aria-label", tName(name, vorsatz) + " " + t("loeschen"));
    loeschen.addEventListener("click", function () {
      if (!window.confirm(t(frage))) return;
      loeschenFunktion(name);
      speichern();
      anzeigen();
    });
    li.append(text, loeschen);
    liste.append(li);
  });
}

function quellenEinstellungenZeichnen() {
  // Laufendes Einkommen: alle eigenen Quellen und alle festen, für die schon Beträge eingetragen sind
  const quellen = alleQuellen().filter(function (name) {
    return daten.eigene.indexOf(name) !== -1 || daten.quellen.some(function (q) { return q.name === name; });
  });
  einstellungenListe("einst-quellen", quellen, "qu_", "qu_loeschen_frage", function (name) {
    daten.eigene = daten.eigene.filter(function (n) { return n !== name; });
    daten.quellen = daten.quellen.filter(function (q) { return q.name !== name; });
  });

  // Sonderzahlungen: jede Bezeichnung, die vorkommt, einmal
  const sonderNamen = [];
  daten.sonder.forEach(function (s) {
    if (sonderNamen.indexOf(s.name) === -1) sonderNamen.push(s.name);
  });
  einstellungenListe("einst-sonder", sonderNamen, "sz_", "sz_loeschen_frage", function (name) {
    daten.sonder = daten.sonder.filter(function (s) { return s.name !== name; });
  });
}

// Bei "Anderes" erscheint ein Textfeld für die Bezeichnung
const sonderArt = document.getElementById("sonder-art");
const sonderName = document.getElementById("sonder-name");

sonderArt.addEventListener("change", function () {
  const anderes = sonderArt.value === "Anderes";
  sonderName.hidden = !anderes;
  sonderName.required = anderes;
});

document.getElementById("sonder-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = sonderArt.value === "Anderes" ? sonderName.value.trim() : sonderArt.value;
  const betrag = zuZahl(document.getElementById("sonder-betrag").value);
  if (name === "" || betrag === null || betrag <= 0) return;
  daten.sonder.push({ monat: monat, name: name, betrag: betrag });
  e.target.reset();
  sonderName.hidden = true;
  sonderName.required = false;
  speichern();
  anzeigen();
});

anzeigen();
