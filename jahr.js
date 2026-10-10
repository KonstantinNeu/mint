// Modul Jahresübersicht (optionaler Bereich): alle 12 Monate zusammengezählt
// Nutzt einkommenSumme(), fixSumme(), ausSumme(), sparenSumme(), schuldenZahlungenFuer(), ueberschussFuer(), geld(), monatText(), modulAktiv().

function jahrAnzeigen() {
  // Summe über alle 12 Monate; null, solange nirgends etwas eingetragen ist
  function jahresSumme(fuer) {
    let summe = 0;
    let etwas = false;
    for (let i = 0; i < 12; i++) {
      const wert = fuer(i);
      if (wert !== null) { summe += wert; etwas = true; }
    }
    return etwas ? summe : null;
  }

  // Zeilen der Jahressumme; abgewählte Bereiche erscheinen nicht
  const zeilen = [
    { bereich: "einkommen", text: "einnahmen", klasse: "einnahme", fuer: einkommenSumme },
    { bereich: "fixkosten", text: "nav_fixkosten", klasse: "ausgabe", fuer: fixSumme },
    { bereich: "ausgaben", text: "ue_ausgaben", klasse: "ausgabe", fuer: ausSumme },
    { bereich: "ruecklage", text: "ue_sparen", klasse: "ausgabe", fuer: sparenSumme },
    { bereich: "schulden", text: "ue_schuldenzahlung", klasse: "ausgabe", fuer: schuldenZahlungenFuer }
  ];

  const summen = document.getElementById("jahr-summen");
  summen.innerHTML = "";
  zeilen.forEach(function (z) {
    if (!modulAktiv(z.bereich)) return;
    const wert = jahresSumme(z.fuer);
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = t(z.text);
    const betrag = document.createElement("strong");
    betrag.className = z.klasse;
    betrag.textContent = wert === null ? "–" : geld(wert);
    li.append(name, betrag);
    summen.append(li);
  });

  // Überschuss: pro Monat und gesamt
  const gesamt = jahresSumme(ueberschussFuer);
  const gesamtFeld = document.getElementById("jahr-ueberschuss");
  gesamtFeld.textContent = gesamt === null ? "–" : geld(gesamt);
  gesamtFeld.className = "gross-zahl" + (gesamt === null ? "" : gesamt < 0 ? " ausgabe" : " einnahme");

  const monate = document.getElementById("jahr-monate");
  monate.innerHTML = "";
  for (let i = 0; i < 12; i++) {
    const wert = ueberschussFuer(i);
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = monatText(i);
    const betrag = document.createElement("strong");
    betrag.textContent = wert === null ? "–" : geld(wert);
    betrag.className = wert === null ? "" : wert < 0 ? "ausgabe" : "einnahme";
    li.append(name, betrag);
    monate.append(li);
  }
}

// Beim Wechsel auf die Jahresübersicht neu rechnen, damit neue Einträge sofort drin sind
document.querySelector('.menue button[data-seite="jahr"]').addEventListener("click", jahrAnzeigen);

jahrAnzeigen();
