// Modul Einstellungen: Sprache, Währung und Kategorien
// Muss nach sprache.js und vor einkommen.js geladen werden, weil dort geld() die Währung und Sprache benutzt.
// Die Daten bleiben nur auf diesem Gerät (localStorage).

const EINST_SPEICHER_NAME = "finanzapp-einstellungen";

// Alle Kategorien, die es für Ausgaben und Budget gibt
const AUS_KATEGORIEN = ["Lebensmittel", "Essen & Trinken", "Tanken", "Freizeit", "Kleidung", "Zigaretten", "Gesundheit", "Sonstiges"];

// Die Namen der Währungen stehen in sprache.js (Schlüssel w_EUR usw.)
const WAEHRUNGEN = {
  EUR: { zeichen: "€" },
  USD: { zeichen: "$" },
  GBP: { zeichen: "£" },
  CHF: { zeichen: "CHF" },
  HUF: { zeichen: "Ft" },
  PLN: { zeichen: "zł" },
  CZK: { zeichen: "Kč" }
};

// Sprache beim ersten Start: die des Geräts, falls wir sie anbieten, sonst Deutsch
function startSprache() {
  const geraet = (navigator.language || "de").slice(0, 2).toLowerCase();
  return SPRACHEN[geraet] ? geraet : "de";
}

// kategorien = gewählte (eingeschaltete) Kategorien, eigene = selbst erstellte
let einstellungen = { sprache: startSprache(), name: "", willkommenGesehen: false, waehrung: "EUR", kategorien: AUS_KATEGORIEN.slice(), eigene: [], module: {} };

try {
  const gespeichert = localStorage.getItem(EINST_SPEICHER_NAME);
  if (gespeichert) einstellungen = Object.assign(einstellungen, JSON.parse(gespeichert));
} catch (fehler) { /* ohne Speicher weiterarbeiten */ }

function einstSpeichern() {
  try { localStorage.setItem(EINST_SPEICHER_NAME, JSON.stringify(einstellungen)); } catch (fehler) { }
}

function waehrungsZeichen() {
  return (WAEHRUNGEN[einstellungen.waehrung] || WAEHRUNGEN.EUR).zeichen;
}

// Alle Kategorien: die mitgelieferten und die selbst erstellten
function alleKategorien() {
  return AUS_KATEGORIEN.concat(einstellungen.eigene);
}

// Nur die Kategorien, die in den Einstellungen gewählt sind
function aktiveKategorien() {
  return alleKategorien().filter(function (k) { return einstellungen.kategorien.indexOf(k) !== -1; });
}

// Alle Seiten neu zeichnen, nachdem sich eine Einstellung geändert hat
function alleSeitenAktualisieren() {
  uebersetzeStatisch();
  waehrungenFuellen();
  sprachenFuellen();
  kategorienListeZeichnen();
  moduleListeZeichnen();
  [
    "kategorienFuellen", "anzeigen", "fixAnzeigen", "ausAnzeigen", "datumAnzeigen",
    "budAnzeigen", "rlAnzeigen", "ueAnzeigen", "schAnzeigen", "rlDatumAnzeigen", "begruessungAnzeigen", "fixEinstellungenZeichnen", "quellenEinstellungenZeichnen", "zielAnzeigen", "jahrAnzeigen", "spStatusZeichnen", "menueAufbauen"
  ].forEach(function (name) {
    if (typeof window[name] === "function") window[name]();
  });
}

// Sprache wählen
const sprachenAuswahl = document.getElementById("einst-sprache");

function sprachenFuellen() {
  sprachenAuswahl.innerHTML = "";
  Object.keys(SPRACHEN).forEach(function (code) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = SPRACHEN[code].name;
    sprachenAuswahl.append(option);
  });
  sprachenAuswahl.value = sprache();
}

sprachenAuswahl.addEventListener("change", function () {
  einstellungen.sprache = sprachenAuswahl.value;
  einstSpeichern();
  alleSeitenAktualisieren();
});

// Währung wählen (die Namen kommen in der gewählten Sprache)
const waehrungsAuswahl = document.getElementById("einst-waehrung");

function waehrungenFuellen() {
  waehrungsAuswahl.innerHTML = "";
  Object.keys(WAEHRUNGEN).forEach(function (code) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = t("w_" + code) + " (" + WAEHRUNGEN[code].zeichen + ")";
    waehrungsAuswahl.append(option);
  });
  waehrungsAuswahl.value = einstellungen.waehrung;
}

waehrungsAuswahl.addEventListener("change", function () {
  einstellungen.waehrung = waehrungsAuswahl.value;
  einstSpeichern();
  alleSeitenAktualisieren();
});
const kategorienListe = document.getElementById("einst-kategorien");

function kategorienListeZeichnen() {
  kategorienListe.innerHTML = "";
  alleKategorien().forEach(function (name) {
    const eigene = einstellungen.eigene.indexOf(name) !== -1;
    const li = document.createElement("li");
    const etikett = document.createElement("label");
    etikett.className = "schalter";
    const text = document.createElement("span");
    text.textContent = tName(name, "kat_");
    const haken = document.createElement("input");
    haken.type = "checkbox";
    haken.checked = einstellungen.kategorien.indexOf(name) !== -1;
    haken.addEventListener("change", function () {
      const neu = alleKategorien().filter(function (k) {
        return k === name ? haken.checked : einstellungen.kategorien.indexOf(k) !== -1;
      });
      if (neu.length === 0) { haken.checked = true; return; }
      einstellungen.kategorien = neu;
      einstSpeichern();
      alleSeitenAktualisieren();
    });
    etikett.append(text, haken);
    li.append(etikett);

    // Eigene Kategorien lassen sich wieder löschen (bereits eingetragene Ausgaben bleiben erhalten)
    if (eigene) {
      const loeschen = document.createElement("button");
      loeschen.type = "button";
      loeschen.textContent = "×";
      loeschen.setAttribute("aria-label", tName(name, "kat_") + " " + t("loeschen"));
      loeschen.addEventListener("click", function () {
        const bleibt = alleKategorien().filter(function (k) {
          return k !== name && einstellungen.kategorien.indexOf(k) !== -1;
        });
        if (bleibt.length === 0) return;
        einstellungen.eigene = einstellungen.eigene.filter(function (k) { return k !== name; });
        einstellungen.kategorien = bleibt;
        einstSpeichern();
        kategorienListeZeichnen();
        alleSeitenAktualisieren();
      });
      li.append(loeschen);
    }
    kategorienListe.append(li);
  });
}

document.getElementById("einst-neue-kategorie-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const feld = document.getElementById("einst-neue-kategorie");
  const name = feld.value.trim().slice(0, 24);
  if (name === "") return;
  const gibtEs = alleKategorien().some(function (k) { return k.toLowerCase() === name.toLowerCase(); });
  if (gibtEs) { feld.setCustomValidity(t("kat_doppelt")); feld.reportValidity(); feld.setCustomValidity(""); return; }
  einstellungen.eigene.push(name);
  einstellungen.kategorien.push(name);
  einstSpeichern();
  feld.value = "";
  kategorienListeZeichnen();
  alleSeitenAktualisieren();
});

kategorienListeZeichnen();

// Bereiche (Reiter) wählen. Übersicht und Einstellungen sind immer da, mindestens ein weiterer Bereich bleibt aktiv.
const BEREICHE = ["einkommen", "fixkosten", "ausgaben", "budget", "ruecklage", "schulden"];

// Zusätzliche Bereiche, die erst auf Wunsch eingeschaltet werden (zählen nicht zu "mindestens ein Bereich")
const ZUSATZ_BEREICHE = ["jahr"];

function modulAktiv(name) {
  if (name === "uebersicht") return true;
  const wahl = einstellungen.module || {};
  if (ZUSATZ_BEREICHE.indexOf(name) !== -1) return wahl[name] === true;
  // Ist durch irgendeinen Fehler gar kein Bereich eingeschaltet, bleibt immer "Einkommen"
  if (BEREICHE.every(function (b) { return wahl[b] === false; })) return name === "einkommen";
  return wahl[name] !== false;
}

const moduleListe = document.getElementById("einst-module");

function moduleListeZeichnen() {
  moduleListe.innerHTML = "";
  BEREICHE.concat(ZUSATZ_BEREICHE).forEach(function (name) {
    const li = document.createElement("li");
    const etikett = document.createElement("label");
    etikett.className = "schalter";
    const text = document.createElement("span");
    text.textContent = t("nav_" + name);
    const haken = document.createElement("input");
    haken.type = "checkbox";
    haken.checked = modulAktiv(name);
    haken.addEventListener("change", function () {
      const neu = Object.assign({}, einstellungen.module);
      BEREICHE.forEach(function (b) { if (neu[b] === undefined) neu[b] = modulAktiv(b); });
      neu[name] = haken.checked;
      // Der letzte eingeschaltete Bereich kann nicht ausgeschaltet werden
      if (BEREICHE.every(function (b) { return neu[b] === false; })) { haken.checked = true; return; }
      einstellungen.module = neu;
      einstSpeichern();
      alleSeitenAktualisieren();
    });
    etikett.append(text, haken);
    li.append(etikett);
    moduleListe.append(li);
  });
}

// Zahnrad-Knopf in der Kopfzeile öffnet die Einstellungen
document.getElementById("einst-knopf").addEventListener("click", function () {
  document.querySelectorAll(".seite").forEach(function (s) { s.classList.remove("aktiv"); });
  document.querySelectorAll(".menue button").forEach(function (k) { k.classList.remove("aktiv"); });
  document.getElementById("menue-griff").classList.remove("hat-aktiv");
  document.getElementById("einstellungen").classList.add("aktiv");
  window.scrollTo(0, 0);
});

// Sicherung: alle Mint-Daten (Schlüssel beginnen mit "finanzapp-") als Datei speichern und wiederherstellen
document.getElementById("sich-sichern").addEventListener("click", function () {
  const paket = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const schluessel = localStorage.key(i);
      if (schluessel.indexOf("finanzapp-") === 0) paket[schluessel] = localStorage.getItem(schluessel);
    }
  } catch (fehler) { }
  const datum = new Date().toISOString().slice(0, 10);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([JSON.stringify({ mint: 1, daten: paket })], { type: "application/json" }));
  link.download = "mint-sicherung-" + datum + ".json";
  link.click();
  URL.revokeObjectURL(link.href);
});

const sichDatei = document.getElementById("sich-datei");

document.getElementById("sich-wiederherstellen").addEventListener("click", function () {
  sichDatei.value = "";
  sichDatei.click();
});

sichDatei.addEventListener("change", function () {
  const datei = sichDatei.files[0];
  if (!datei) return;
  const leser = new FileReader();
  leser.onload = function () {
    let paket;
    try { paket = JSON.parse(leser.result); } catch (fehler) { paket = null; }
    const daten = paket && paket.mint === 1 && paket.daten;
    const schluessel = daten ? Object.keys(daten).filter(function (k) { return k.indexOf("finanzapp-") === 0; }) : [];
    // Jeder Wert muss selbst wieder lesbare Daten sein, sonst wird nichts überschrieben
    const lesbar = schluessel.every(function (k) {
      try { return typeof JSON.parse(daten[k]) === "object"; } catch (fehler) { return false; }
    });
    if (schluessel.length === 0 || !lesbar) { alert(t("sich_fehler")); return; }
    if (!confirm(t("sich_frage"))) return;
    try {
      const alt = [];
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).indexOf("finanzapp-") === 0) alt.push(localStorage.key(i));
      }
      alt.forEach(function (k) { localStorage.removeItem(k); });
      schluessel.forEach(function (k) { localStorage.setItem(k, String(daten[k])); });
    } catch (fehler) { }
    location.reload();
  };
  leser.readAsText(datei);
});

alleSeitenAktualisieren();
