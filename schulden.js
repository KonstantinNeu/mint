// Modul Schulden: mehrere Schulden mit Gesamtbetrag, Monatsrate, Zahlungen und Fortschrittsbalken
// Nutzt geld(), zuZahl() aus einkommen.js sowie isoZuDatum(), datumZuIso(), kurzDatum() aus ausgaben.js.
// Die Daten bleiben nur auf diesem Gerät (localStorage).

const SCH_SPEICHER_NAME = "finanzapp-schulden";
const SCHULD_ARTEN = ["Kredit", "Privatkonkurs", "Kreditkarte", "Autokredit", "Studienkredit", "Wohnungskredit", "Überziehung", "Steuerschuld", "Privatdarlehen", "Ratenkauf", "Sonstiges"];

let schDaten = []; // [{ id, art, name, gesamt, rate, zahlungen: [{ datum, betrag }] }]

try {
  const gespeichert = localStorage.getItem(SCH_SPEICHER_NAME);
  if (gespeichert) schDaten = JSON.parse(gespeichert);
} catch (fehler) { /* ohne Speicher weiterarbeiten */ }

function schSpeichern() {
  try { localStorage.setItem(SCH_SPEICHER_NAME, JSON.stringify(schDaten)); } catch (fehler) { }
}

function schBezahlt(s) {
  return s.zahlungen.reduce(function (summe, z) { return summe + z.betrag; }, 0);
}

function schOffen(s) {
  return Math.max(0, s.gesamt - schBezahlt(s));
}

// Gesamte offene Summe für die Übersicht; null, solange es keine Schuld gibt
function schuldenOffen() {
  if (schDaten.length === 0) return null;
  return schDaten.reduce(function (summe, s) { return summe + schOffen(s); }, 0);
}

// Ohne eigenen Namen zeigt die Schuld ihre Art ("Kredit", "Privatkonkurs" ...) in der gewählten Sprache
function schName(s) {
  return s.name || tName(s.art, "sa_");
}

// Zahlungen pro Jahr: 12 (monatlich) oder 14 (z. B. mit Urlaubs- und Weihnachtsgeld)
function schProJahr(s) {
  return s.proJahr === 14 ? 14 : 12;
}

// Durchschnittliche Rate pro Monat (bei 14 Zahlungen im Jahr: Rate mal 14 geteilt durch 12)
function schMonatsRate(s) {
  return (s.rate || 0) * schProJahr(s) / 12;
}

// Summe der Zahlungen, die in einem Monat gebucht wurden (alle Schulden); null, wenn es keine gibt
function schuldenZahlungenFuer(i) {
  let summe = 0;
  let anzahl = 0;
  schDaten.forEach(function (s) {
    s.zahlungen.forEach(function (z) {
      if (monatNummer(isoZuDatum(z.datum)) === i) { summe += z.betrag; anzahl++; }
    });
  });
  return anzahl === 0 ? null : summe;
}

// "Noch 51 Monate bei dieser Rate (bis Dez 2030)", "Abbezahlt!" oder "Keine Monatsrate festgelegt"
// Die erste Zahlung zählt für den laufenden Monat; ist dafür schon gezahlt, beginnt es im nächsten Monat.
function schRestText(s) {
  const offen = schOffen(s);
  if (offen === 0) return t("sch_abbezahlt");
  if (!(s.rate > 0)) return t("sch_keine_rate");
  const monate = Math.ceil(offen / schMonatsRate(s) - 0.000001);
  const heute = new Date();
  const dieserMonat = datumZuIso(heute).slice(0, 7);
  const schonGezahlt = s.zahlungen.some(function (z) { return z.datum.slice(0, 7) === dieserMonat; });
  const ende = new Date(heute.getFullYear(), heute.getMonth() + monate - 1 + (schonGezahlt ? 1 : 0), 1);
  const bis = monatNameKurz(ende.getMonth()) + " " + ende.getFullYear();
  return t(monate === 1 ? "sch_noch_monat1" : "sch_noch_monate").replace("{n}", monate).replace("{m}", bis);
}

function schNeueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Die Auswahl der Art in der Karte "Neue Schuld"
const schArtAuswahl = document.getElementById("sch-art");

function schArtenFuellen() {
  const bisher = schArtAuswahl.value;
  schArtAuswahl.innerHTML = "";
  SCHULD_ARTEN.forEach(function (art) {
    const option = document.createElement("option");
    option.value = art;
    option.textContent = tName(art, "sa_");
    schArtAuswahl.append(option);
  });
  if (SCHULD_ARTEN.indexOf(bisher) !== -1) schArtAuswahl.value = bisher;
}

// Auswahl "12 oder 14 Zahlungen pro Jahr" (in der Karte "Neue Schuld")
const schProJahrAuswahl = document.getElementById("sch-proJahr");

function schProJahrFuellen(auswahl, wert) {
  auswahl.innerHTML = "";
  [12, 14].forEach(function (zahl) {
    const option = document.createElement("option");
    option.value = zahl;
    option.textContent = t("sch_pj" + zahl);
    auswahl.append(option);
  });
  auswahl.value = String(wert || 12);
}

function schAnzeigen() {
  schArtenFuellen();
  schProJahrFuellen(schProJahrAuswahl, schProJahrAuswahl.value);

  // Aufgeklappte Schulden bleiben nach dem Neuzeichnen aufgeklappt
  const offeneIds = Array.prototype.map.call(
    document.querySelectorAll("#sch-liste details[open]"),
    function (d) { return d.dataset.id; }
  );

  // Gesamtkarte
  const gesamtFeld = document.getElementById("sch-offen-gesamt");
  const gesamtBalken = document.getElementById("sch-gesamt-balken");
  const gesamtNotiz = document.getElementById("sch-gesamt-notiz");
  const ratenNotiz = document.getElementById("sch-raten-notiz");
  if (schDaten.length === 0) {
    gesamtFeld.textContent = "–";
    gesamtBalken.hidden = true;
    gesamtNotiz.textContent = t("sch_keine");
    ratenNotiz.textContent = "";
  } else {
    let gesamt = 0;
    let bezahlt = 0;
    let raten = 0;
    schDaten.forEach(function (s) {
      gesamt += s.gesamt;
      bezahlt += Math.min(schBezahlt(s), s.gesamt);
      if (schOffen(s) > 0) raten += schMonatsRate(s);
    });
    gesamtFeld.textContent = geld(schuldenOffen());
    gesamtBalken.hidden = false;
    gesamtBalken.querySelector("span").style.width = (gesamt > 0 ? Math.min(100, bezahlt / gesamt * 100) : 0) + "%";
    gesamtNotiz.textContent = t("sch_bezahlt_von").replace("{a}", geld(bezahlt)).replace("{b}", geld(gesamt));
    ratenNotiz.textContent = t("sch_raten_gesamt").replace("{x}", geld(raten));
  }

  // Die Karte "Neue Schuld" ist offen, solange es noch keine Schuld gibt
  document.getElementById("sch-neu-karte").open = schDaten.length === 0 || document.getElementById("sch-neu-karte").open;

  // Liste der Schulden
  const liste = document.getElementById("sch-liste");
  liste.innerHTML = "";
  schDaten.forEach(function (s) {
    const offen = schOffen(s);
    const li = document.createElement("li");
    const klappe = document.createElement("details");
    klappe.className = "aufklapp";
    klappe.dataset.id = s.id;
    klappe.open = offeneIds.indexOf(s.id) !== -1;

    // Kopfzeile: Name links, offener Betrag rechts, darunter Balken und Satz zur Restdauer
    const kopf = document.createElement("summary");
    const inhalt = document.createElement("div");
    inhalt.className = "budget-kopf";
    const zeile = document.createElement("div");
    zeile.className = "budget-zeile";
    const nameFeld = document.createElement("span");
    nameFeld.textContent = schName(s);
    const offenFeld = document.createElement("span");
    offenFeld.className = offen > 0 ? "ausgabe" : "einnahme";
    offenFeld.textContent = geld(offen);
    zeile.append(nameFeld, offenFeld);
    const balken = document.createElement("div");
    balken.className = "balken";
    balken.append(document.createElement("span"));
    balken.querySelector("span").style.width = (s.gesamt > 0 ? Math.min(100, schBezahlt(s) / s.gesamt * 100) : 0) + "%";
    const notiz = document.createElement("div");
    notiz.className = "budget-notiz";
    notiz.style.marginTop = "0";
    // Hat die Schuld keinen eigenen Namen, steht die Art schon als Name da und wird nicht wiederholt
    notiz.textContent = (s.name ? tName(s.art, "sa_") + " · " : "") + schRestText(s);
    inhalt.append(zeile, balken, notiz);
    kopf.append(inhalt);

    const detail = document.createElement("div");
    detail.className = "sch-detail";

    // Zahlung eintragen
    const zahlForm = document.createElement("form");
    const zahlFeld = document.createElement("input");
    zahlFeld.type = "text";
    zahlFeld.setAttribute("inputmode", "decimal");
    zahlFeld.autocomplete = "off";
    zahlFeld.required = true;
    zahlFeld.placeholder = t("betrag_in") + " " + waehrungsZeichen();
    const zahlKnopf = document.createElement("button");
    zahlKnopf.type = "submit";
    zahlKnopf.textContent = t("buchen");
    zahlForm.append(zahlFeld, zahlKnopf);
    zahlForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const betrag = zuZahl(zahlFeld.value);
      if (betrag === null || betrag <= 0) return;
      s.zahlungen.push({ datum: datumZuIso(new Date()), betrag: betrag });
      schSpeichern();
      schAnzeigen();
    });

    // Bisherige Zahlungen, die neuesten zuerst
    const zahlTitel = document.createElement("p");
    zahlTitel.className = "hinweis";
    zahlTitel.textContent = t("sch_zahlungen");
    const zahlListe = document.createElement("ul");
    zahlListe.className = "liste";
    if (s.zahlungen.length === 0) {
      const leer = document.createElement("li");
      leer.className = "hinweis";
      leer.textContent = t("sch_keine_zahlungen");
      zahlListe.append(leer);
    }
    s.zahlungen.slice().reverse().forEach(function (z) {
      const eintrag = document.createElement("li");
      const datum = document.createElement("span");
      datum.textContent = kurzDatum(isoZuDatum(z.datum));
      const betrag = document.createElement("span");
      betrag.className = "einnahme";
      betrag.textContent = geld(z.betrag);
      const weg = document.createElement("button");
      weg.type = "button";
      weg.textContent = "×";
      weg.setAttribute("aria-label", t("loeschen"));
      weg.addEventListener("click", function () {
        s.zahlungen = s.zahlungen.filter(function (x) { return x !== z; });
        schSpeichern();
        schAnzeigen();
      });
      const aendern = bearbeitenKnopf(function () {
        eintragBearbeiten(eintrag, kurzDatum(isoZuDatum(z.datum)), [{ typ: "betrag", wert: z.betrag }], function (werte) {
          const neu = zuZahl(werte[0]);
          if (neu === null || neu <= 0) return false;
          z.betrag = neu;
          schSpeichern();
          schAnzeigen();
        }, schAnzeigen);
      });
      eintrag.append(datum, betrag, aendern, weg);
      zahlListe.append(eintrag);
    });

    // Monatsrate ändern
    const rateTitel = document.createElement("p");
    rateTitel.className = "hinweis";
    rateTitel.textContent = t("sch_rate_aendern") + (s.rate > 0 ? " (" + geld(s.rate) + ", " + t("sch_pj" + schProJahr(s)) + ")" : "");
    const rateForm = document.createElement("form");
    const rateFeld = document.createElement("input");
    rateFeld.type = "text";
    rateFeld.setAttribute("inputmode", "decimal");
    rateFeld.autocomplete = "off";
    rateFeld.required = true;
    rateFeld.placeholder = t("sch_rate_in") + " " + waehrungsZeichen();
    const rateKnopf = document.createElement("button");
    rateKnopf.type = "submit";
    rateKnopf.textContent = t("buchen");
    const rateJahr = document.createElement("select");
    rateJahr.className = "auswahl";
    schProJahrFuellen(rateJahr, schProJahr(s));
    rateForm.append(rateJahr, rateFeld, rateKnopf);
    rateForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const neu = zuZahl(rateFeld.value);
      if (neu === null || neu < 0) return;
      s.rate = neu;
      s.proJahr = Number(rateJahr.value) === 14 ? 14 : 12;
      schSpeichern();
      schAnzeigen();
    });

    // Ganze Schuld löschen
    const loeschen = document.createElement("button");
    loeschen.type = "button";
    loeschen.className = "sch-loeschen";
    loeschen.textContent = t("sch_loeschen");
    loeschen.addEventListener("click", function () {
      if (!window.confirm(t("sch_loeschen_frage"))) return;
      schDaten = schDaten.filter(function (x) { return x !== s; });
      schSpeichern();
      schAnzeigen();
    });

    detail.append(zahlForm, zahlTitel, zahlListe, rateTitel, rateForm, loeschen);
    klappe.append(kopf, detail);
    li.append(klappe);
    liste.append(li);
  });
}

// Neue Schuld anlegen
document.getElementById("sch-neu-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const gesamt = zuZahl(document.getElementById("sch-gesamt-betrag").value);
  if (gesamt === null || gesamt <= 0) return;
  const rate = zuZahl(document.getElementById("sch-rate-betrag").value);
  schDaten.push({
    id: schNeueId(),
    art: schArtAuswahl.value,
    name: document.getElementById("sch-name").value.trim(),
    gesamt: gesamt,
    rate: rate !== null && rate > 0 ? rate : 0,
    proJahr: Number(document.getElementById("sch-proJahr").value) === 14 ? 14 : 12,
    zahlungen: []
  });
  schSpeichern();
  e.target.reset();
  document.getElementById("sch-neu-karte").open = false;
  schAnzeigen();
});

// Beim Wechsel auf die Schulden neu zeichnen
document.querySelector('.menue button[data-seite="schulden"]').addEventListener("click", schAnzeigen);

schAnzeigen();
