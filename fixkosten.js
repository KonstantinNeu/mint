// Modul Fixkosten: feste monatliche Kosten als Summen
// Nutzt geld(), zuZahl(), monatText() aus einkommen.js.

const FIX_SPEICHER_NAME = "finanzapp-fixkosten";
const FIX_POSTEN_NAME = "finanzapp-fixkosten-posten";

let fixDaten = {}; // z. B. { Miete: [{ ab: 0, betrag: 600 }] }
let fixMonat = 0;
let fixPosten = null; // Namen der Fixkosten-Posten in der gewählten Reihenfolge, z. B. ["Miete", "Strom"]

try {
  const gespeichert = localStorage.getItem(FIX_SPEICHER_NAME);
  if (gespeichert) fixDaten = JSON.parse(gespeichert);
} catch (fehler) { /* ohne Speicher weiterarbeiten */ }

function fixSpeichern() {
  try { localStorage.setItem(FIX_SPEICHER_NAME, JSON.stringify(fixDaten)); } catch (fehler) { }
}

function fixPostenSpeichern() {
  try { localStorage.setItem(FIX_POSTEN_NAME, JSON.stringify(fixPosten)); } catch (fehler) { }
}

try {
  const gespeichert = localStorage.getItem(FIX_POSTEN_NAME);
  if (gespeichert) fixPosten = JSON.parse(gespeichert);
} catch (fehler) { /* ohne Speicher weiterarbeiten */ }

// Früher gab es feste Posten. Wer dafür schon Beträge eingetragen hat, behält diese Posten als eigene,
// alle anderen fangen leer an. "Privatkonkurs" steht jetzt im Reiter Schulden und kommt nicht mit.
if (fixPosten === null) {
  const frueher = ["Miete", "Strom", "Handy", "Internet", "Auto", "Playstation", "Gym", "KI"];
  fixPosten = frueher.filter(function (name) { return fixDaten[name] && fixDaten[name].length > 0; });
  fixPostenSpeichern();
}

// Betrag des Monats: der letzte Eintrag, der ab diesem Monat oder früher gilt
function fixBetragFuer(name, i) {
  let treffer = null;
  (fixDaten[name] || []).forEach(function (e) {
    if (e.ab <= i && (treffer === null || e.ab >= treffer.ab)) treffer = e;
  });
  return treffer ? treffer.betrag : null;
}

// Fixkosten-Summe eines Monats; null, wenn für den Monat nichts eingetragen ist
function fixSumme(i) {
  let summe = 0;
  let etwasEingetragen = false;
  fixPosten.forEach(function (name) {
    const betrag = fixBetragFuer(name, i);
    if (betrag !== null) { summe += betrag; etwasEingetragen = true; }
  });
  return etwasEingetragen ? summe : null;
}

function fixAnzeigen() {
  document.getElementById("fix-monat-name").textContent = monatText(fixMonat);
  document.getElementById("fix-zurueck").disabled = fixMonat === 0;
  document.getElementById("fix-vor").disabled = fixMonat === 11;

  // Ohne Posten erscheint ein Hinweis mit Weg zu den Einstellungen
  document.getElementById("fix-leer").hidden = fixPosten.length > 0;

  const liste = document.getElementById("fix-liste");
  liste.innerHTML = "";
  let summe = 0;
  let etwasEingetragen = false;

  fixPosten.forEach(function (name) {
    const betrag = fixBetragFuer(name, fixMonat);
    if (betrag !== null) { summe += betrag; etwasEingetragen = true; }

    const li = document.createElement("li");
    const klappe = document.createElement("details");
    klappe.className = "aufklapp";
    const kopf = document.createElement("summary");

    const nameFeld = document.createElement("span");
    nameFeld.className = "fix-name";
    nameFeld.textContent = tName(name, "fix_");

    const betragFeld = document.createElement("span");
    betragFeld.className = "ausgabe";
    betragFeld.textContent = betrag === null ? "–" : geld(betrag);

    const form = document.createElement("form");
    const eingabe = document.createElement("input");
    eingabe.type = "text";
    eingabe.setAttribute("inputmode", "decimal");
    eingabe.placeholder = t("betrag_in") + " " + waehrungsZeichen();
    eingabe.required = true;
    const knopf = document.createElement("button");
    knopf.type = "submit";
    knopf.textContent = t("buchen");
    form.append(eingabe, knopf);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const neu = zuZahl(eingabe.value);
      if (neu === null || neu < 0) return;
      // Gibt es für diesen Monat schon einen Eintrag, wird er ersetzt
      const eintraege = (fixDaten[name] || []).filter(function (x) { return x.ab !== fixMonat; });
      eintraege.push({ ab: fixMonat, betrag: neu });
      fixDaten[name] = eintraege;
      fixSpeichern();
      fixAnzeigen();
    });

    kopf.append(nameFeld, betragFeld);
    klappe.append(kopf, form);
    li.append(klappe);
    liste.append(li);
  });

  // Monate ohne Einträge bleiben leer (kein 0,00 €)
  document.getElementById("fix-summe").textContent = etwasEingetragen ? geld(summe) : "–";
}

document.getElementById("fix-zurueck").addEventListener("click", function () {
  if (fixMonat > 0) { fixMonat--; fixAnzeigen(); }
});
document.getElementById("fix-vor").addEventListener("click", function () {
  if (fixMonat < 11) { fixMonat++; fixAnzeigen(); }
});

fixAnzeigen();

// Posten in den Einstellungen anlegen und löschen
function fixEinstellungenZeichnen() {
  const liste = document.getElementById("einst-fix");
  liste.innerHTML = "";
  fixPosten.forEach(function (name) {
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = tName(name, "fix_");
    const loeschen = document.createElement("button");
    loeschen.type = "button";
    loeschen.textContent = "×";
    loeschen.setAttribute("aria-label", tName(name, "fix_") + " " + t("loeschen"));
    loeschen.addEventListener("click", function () {
      if (!window.confirm(t("fix_loeschen_frage"))) return;
      fixPosten = fixPosten.filter(function (n) { return n !== name; });
      delete fixDaten[name];
      fixPostenSpeichern();
      fixSpeichern();
      fixEinstellungenZeichnen();
      fixAnzeigen();
    });
    li.append(text, loeschen);
    liste.append(li);
  });
}

document.getElementById("einst-fix-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const feld = document.getElementById("einst-fix-name");
  const name = feld.value.trim().slice(0, 30);
  if (name === "") return;
  const gibtEs = fixPosten.some(function (n) { return n.toLowerCase() === name.toLowerCase(); });
  if (gibtEs) { feld.setCustomValidity(t("fix_doppelt")); feld.reportValidity(); feld.setCustomValidity(""); return; }
  fixPosten.push(name);
  fixPostenSpeichern();
  feld.value = "";
  fixEinstellungenZeichnen();
  fixAnzeigen();
});

// Hinweis auf der leeren Fixkosten-Seite: Knopf führt zu den Einstellungen
document.getElementById("fix-zu-einst").addEventListener("click", function () {
  document.getElementById("einst-knopf").click();
});

fixEinstellungenZeichnen();
