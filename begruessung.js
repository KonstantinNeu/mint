// Begrüßung auf der Übersicht ("Hallo Name" plus ein Spruch) und die Namensfrage beim ersten Start
// Nutzt BEGRUESSUNGEN, SPRUECHE, SPRUCH_ZEIT, NAMENSFRAGEN aus sprueche.js sowie einstellungen und einstSpeichern() aus einstellungen.js.

// Pro App-Start wird einmal gewürfelt, damit sich der Text beim Sprachwechsel nicht ändert
const grussNr = Math.floor(Math.random() * BEGRUESSUNGEN.de.length);
const frageNr = Math.floor(Math.random() * NAMENSFRAGEN.de.length);
const spruchNr = spruchWaehlen();

// Sprüche für bestimmte Monate oder Wochentage kommen bevorzugt, wenn es gerade passt (in der Hälfte der Fälle)
function spruchWaehlen() {
  const heute = new Date();
  const monat = heute.getMonth() + 1;
  const wochentag = heute.getDay();
  const immer = [];
  const passend = [];
  SPRUCH_ZEIT.forEach(function (zeit, i) {
    if (zeit === null) { immer.push(i); return; }
    const monatPasst = !zeit.monate || zeit.monate.indexOf(monat) !== -1;
    const tagPasst = !zeit.tage || zeit.tage.indexOf(wochentag) !== -1;
    if (monatPasst && tagPasst) passend.push(i);
  });
  const liste = passend.length > 0 && Math.random() < 0.5 ? passend : immer;
  return liste[Math.floor(Math.random() * liste.length)];
}

function begruessungAnzeigen() {
  const name = (einstellungen.name || "").trim();
  let gruss = BEGRUESSUNGEN[sprache()][grussNr];
  // Ohne Namen entfällt der Name samt Komma davor
  gruss = name ? gruss.replace("{name}", name) : gruss.replace(/,?\s*\{name\}/, "");
  document.getElementById("gruss").textContent = gruss;
  document.getElementById("spruch").textContent = SPRUECHE[sprache()][spruchNr];
  document.getElementById("einst-name").value = name;
}

// Name in den Einstellungen ändern
document.getElementById("einst-name-form").addEventListener("submit", function (e) {
  e.preventDefault();
  einstellungen.name = document.getElementById("einst-name").value.trim();
  einstSpeichern();
  begruessungAnzeigen();
});

// Namensfrage beim allerersten Start (erscheint nach der Start-Animation, nur ein einziges Mal)
let willkommenGezeigt = false;

function willkommenPruefen() {
  if (willkommenGezeigt || einstellungen.willkommenGesehen) return;
  willkommenGezeigt = true;
  const seite = document.getElementById("willkommen");
  document.getElementById("willkommen-frage").textContent = NAMENSFRAGEN[sprache()][frageNr];
  seite.hidden = false;
  setTimeout(function () { document.getElementById("willkommen-name").focus(); }, 400);
}

function willkommenSchliessen(name) {
  einstellungen.name = name;
  einstellungen.willkommenGesehen = true;
  einstSpeichern();
  document.getElementById("willkommen").hidden = true;
  begruessungAnzeigen();
}

document.getElementById("willkommen-form").addEventListener("submit", function (e) {
  e.preventDefault();
  willkommenSchliessen(document.getElementById("willkommen-name").value.trim());
});

document.getElementById("willkommen-skip").addEventListener("click", function () {
  willkommenSchliessen("");
});

begruessungAnzeigen();
