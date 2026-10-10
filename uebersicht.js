// Modul Übersicht: rechnet die gewählten Bereiche (Einnahmen, Fixkosten, Ausgaben, Sparen, Schuldenzahlungen) zum Monatsüberschuss zusammen
// Nutzt einkommenSumme(), fixSumme(), ausSumme(), sparenSumme(), rlStand(), schuldenZahlungenFuer(), schuldenOffen(), geld(), monatText(), monatNummer() aus den anderen Dateien.

let ueMonat = 0; // 0 = Oktober 2026 ... 11 = September 2027

// Startmonat: der aktuelle Monat, falls er im Zeitraum liegt
if (monatNummer(new Date()) >= 0) ueMonat = monatNummer(new Date());

function betragText(zahl) {
  return zahl === null ? "–" : geld(zahl);
}

// Monatsüberschuss eines Monats: Einnahmen minus Fixkosten, Ausgaben, Sparen und Schuldenzahlungen.
// Abgewählte Bereiche zählen nicht mit. Gibt null zurück, wenn für den Monat nichts eingetragen ist (kein 0,00 €).
function ueberschussFuer(i) {
  const einnahmen = modulAktiv("einkommen") ? einkommenSumme(i) : null;
  const fix = modulAktiv("fixkosten") ? fixSumme(i) : null;
  const ausgaben = modulAktiv("ausgaben") ? ausSumme(i) : null;
  const sparen = modulAktiv("ruecklage") ? sparenSumme(i) : null;
  const schuldenZahlung = modulAktiv("schulden") && typeof schuldenZahlungenFuer === "function" ? schuldenZahlungenFuer(i) : null;
  if (einnahmen === null && fix === null && ausgaben === null && sparen === null && schuldenZahlung === null) return null;
  return (einnahmen || 0) - (fix || 0) - (ausgaben || 0) - (sparen || 0) - (schuldenZahlung || 0);
}

function ueAnzeigen() {
  document.getElementById("ue-monat-name").textContent = monatText(ueMonat);
  document.getElementById("ue-zurueck").disabled = ueMonat === 0;
  document.getElementById("ue-vor").disabled = ueMonat === 11;

  // Abgewählte Bereiche zählen nicht mit und erscheinen hier nicht
  const mitEinkommen = modulAktiv("einkommen");
  const mitFix = modulAktiv("fixkosten");
  const mitAusgaben = modulAktiv("ausgaben");
  const mitSparen = modulAktiv("ruecklage");
  const mitSchulden = modulAktiv("schulden");
  ["ue-einnahmen", "ue-fix", "ue-ausgaben", "ue-sparen", "ue-schuldenzahlung"].forEach(function (id, i) {
    document.getElementById(id).parentElement.hidden = ![mitEinkommen, mitFix, mitAusgaben, mitSparen, mitSchulden][i];
  });
  document.getElementById("ue-ruecklage").parentElement.hidden = !mitSparen;
  document.getElementById("ue-schulden").parentElement.hidden = !mitSchulden;

  const einnahmen = mitEinkommen ? einkommenSumme(ueMonat) : null;
  const fix = mitFix ? fixSumme(ueMonat) : null;
  const ausgaben = mitAusgaben ? ausSumme(ueMonat) : null;
  const sparen = mitSparen ? sparenSumme(ueMonat) : null;                // gespart minus entnommen
  const schuldenZahlung = mitSchulden && typeof schuldenZahlungenFuer === "function" ? schuldenZahlungenFuer(ueMonat) : null;

  document.getElementById("ue-einnahmen").textContent = betragText(einnahmen);
  document.getElementById("ue-fix").textContent = betragText(fix);
  document.getElementById("ue-ausgaben").textContent = betragText(ausgaben);

  // Gespartes Geld und Schuldenzahlungen verlassen das Konto: rot; wer mehr entnimmt als spart: grün
  const sparenFeld = document.getElementById("ue-sparen");
  sparenFeld.textContent = betragText(sparen === null ? null : Math.abs(sparen));
  sparenFeld.className = sparen === null ? "" : sparen < 0 ? "einnahme" : "ausgabe";
  document.getElementById("ue-schuldenzahlung").textContent = betragText(schuldenZahlung);

  // Monatsüberschuss (Monate ohne Einträge bleiben leer)
  const ueberschussFeld = document.getElementById("ue-ueberschuss");
  const ueberschuss = ueberschussFuer(ueMonat);
  if (ueberschuss === null) {
    ueberschussFeld.textContent = "–";
    ueberschussFeld.className = "gross-zahl";
  } else {
    ueberschussFeld.textContent = geld(ueberschuss);
    ueberschussFeld.className = "gross-zahl " + (ueberschuss < 0 ? "ausgabe" : "einnahme");
  }

  document.getElementById("ue-ruecklage").textContent = betragText(rlStand());
  document.getElementById("ue-schulden").textContent = betragText(typeof schuldenOffen === "function" ? schuldenOffen() : null);
}

document.getElementById("ue-zurueck").addEventListener("click", function () {
  if (ueMonat > 0) { ueMonat--; ueAnzeigen(); }
});
document.getElementById("ue-vor").addEventListener("click", function () {
  if (ueMonat < 11) { ueMonat++; ueAnzeigen(); }
});

// Beim Wechsel auf die Übersicht neu rechnen, damit neue Einträge sofort drin sind
document.querySelector('.menue button[data-seite="uebersicht"]').addEventListener("click", ueAnzeigen);

ueAnzeigen();
