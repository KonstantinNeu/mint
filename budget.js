// Modul Budget: pro Kategorie ein Monatsbudget, der Fortschritt kommt automatisch aus den Ausgaben
// Nutzt geld(), zuZahl(), monatText() aus einkommen.js sowie aktiveKategorien() aus einstellungen.js, ausDaten, monatNummer(), isoZuDatum() aus ausgaben.js.

const BUD_SPEICHER_NAME = "finanzapp-budget";

let budDaten = {}; // z. B. { Tanken: [{ ab: 0, betrag: 200 }] }
let budMonat = 0;  // 0 = Oktober 2026 ... 11 = September 2027

try {
  const gespeichert = localStorage.getItem(BUD_SPEICHER_NAME);
  if (gespeichert) budDaten = JSON.parse(gespeichert);
} catch (fehler) { /* ohne Speicher weiterarbeiten */ }

// Startmonat: der aktuelle Monat, falls er im Zeitraum liegt
if (monatNummer(new Date()) >= 0) budMonat = monatNummer(new Date());

function budSpeichern() {
  try { localStorage.setItem(BUD_SPEICHER_NAME, JSON.stringify(budDaten)); } catch (fehler) { }
}

// Budget des Monats: der letzte Eintrag, der ab diesem Monat oder früher gilt (0 = kein Budget)
function budgetFuer(kategorie, i) {
  let treffer = null;
  (budDaten[kategorie] || []).forEach(function (e) {
    if (e.ab <= i && (treffer === null || e.ab >= treffer.ab)) treffer = e;
  });
  return treffer && treffer.betrag > 0 ? treffer.betrag : null;
}

// Bisher ausgegeben: Anzahl und Summe der Ausgaben dieser Kategorie in diesem Monat
function ausgegebenFuer(kategorie, i) {
  let summe = 0;
  let anzahl = 0;
  ausDaten.forEach(function (e) {
    if (e.kategorie === kategorie && monatNummer(isoZuDatum(e.datum)) === i) {
      summe += e.betrag;
      anzahl++;
    }
  });
  return { summe: summe, anzahl: anzahl };
}

// Balken füllen: grün bis 80 %, gold bis 100 %, rot darüber
function balkenFuellen(balken, ausgegeben, budget) {
  const anteil = ausgegeben / budget;
  const fuell = balken.querySelector("span");
  fuell.style.width = Math.min(100, anteil * 100) + "%";
  fuell.className = anteil > 1 ? "ueber" : anteil >= 0.8 ? "warnung" : "";
}

function notizText(ausgegeben, budget) {
  return ausgegeben <= budget
    ? t("noch_uebrig").replace("{x}", geld(budget - ausgegeben))
    : t("ueberschritten").replace("{x}", geld(ausgegeben - budget));
}

function budAnzeigen() {
  document.getElementById("bud-monat-name").textContent = monatText(budMonat);
  document.getElementById("bud-zurueck").disabled = budMonat === 0;
  document.getElementById("bud-vor").disabled = budMonat === 11;

  const liste = document.getElementById("bud-liste");
  liste.innerHTML = "";
  let budgetSumme = 0;
  let ausgegebenSumme = 0; // nur Kategorien mit Budget

  aktiveKategorien().forEach(function (name) {
    const budget = budgetFuer(name, budMonat);
    const stand = ausgegebenFuer(name, budMonat);
    if (budget !== null) {
      budgetSumme += budget;
      ausgegebenSumme += stand.summe;
    }

    const li = document.createElement("li");
    const klappe = document.createElement("details");
    klappe.className = "aufklapp";
    const kopf = document.createElement("summary");

    const inhalt = document.createElement("div");
    inhalt.className = "budget-kopf";

    const zeile = document.createElement("div");
    zeile.className = "budget-zeile";
    const nameFeld = document.createElement("span");
    nameFeld.textContent = tName(name, "kat_");
    const betragFeld = document.createElement("span");
    const ausgegebenText = stand.anzahl === 0 ? "–" : geld(stand.summe);
    betragFeld.textContent = budget === null ? ausgegebenText : ausgegebenText + " / " + geld(budget);
    betragFeld.className = budget !== null && stand.summe > budget ? "ausgabe" : "";
    zeile.append(nameFeld, betragFeld);
    inhalt.append(zeile);

    if (budget !== null) {
      const balken = document.createElement("div");
      balken.className = "balken";
      balken.append(document.createElement("span"));
      balkenFuellen(balken, stand.summe, budget);
      const notiz = document.createElement("div");
      notiz.className = "budget-notiz";
      notiz.style.marginTop = "0";
      notiz.textContent = notizText(stand.summe, budget);
      inhalt.append(balken, notiz);
    } else {
      const notiz = document.createElement("div");
      notiz.className = "budget-notiz";
      notiz.style.marginTop = "0";
      notiz.textContent = t("kein_budget");
      inhalt.append(notiz);
    }
    kopf.append(inhalt);

    const form = document.createElement("form");
    const eingabe = document.createElement("input");
    eingabe.type = "text";
    eingabe.setAttribute("inputmode", "decimal");
    eingabe.placeholder = t("bud_in") + " " + waehrungsZeichen();
    eingabe.autocomplete = "off";
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
      const eintraege = (budDaten[name] || []).filter(function (x) { return x.ab !== budMonat; });
      eintraege.push({ ab: budMonat, betrag: neu });
      budDaten[name] = eintraege;
      budSpeichern();
      budAnzeigen();
    });

    klappe.append(kopf, form);
    li.append(klappe);
    liste.append(li);
  });

  // Gesamtkarte oben (Monate ohne Budget bleiben leer)
  const gesamtFeld = document.getElementById("bud-gesamt");
  const gesamtBalken = document.getElementById("bud-gesamt-balken");
  const gesamtNotiz = document.getElementById("bud-gesamt-notiz");
  if (budgetSumme === 0) {
    gesamtFeld.textContent = "–";
    gesamtBalken.hidden = true;
    gesamtNotiz.textContent = t("bud_kein_gesetzt");
  } else {
    gesamtFeld.textContent = geld(ausgegebenSumme) + " / " + geld(budgetSumme);
    gesamtBalken.hidden = false;
    balkenFuellen(gesamtBalken, ausgegebenSumme, budgetSumme);
    gesamtNotiz.textContent = notizText(ausgegebenSumme, budgetSumme);
  }
}

document.getElementById("bud-zurueck").addEventListener("click", function () {
  if (budMonat > 0) { budMonat--; budAnzeigen(); }
});
document.getElementById("bud-vor").addEventListener("click", function () {
  if (budMonat < 11) { budMonat++; budAnzeigen(); }
});

// Beim Wechsel auf das Budget neu rechnen, damit neue Ausgaben sofort drin sind
document.querySelector('.menue button[data-seite="budget"]').addEventListener("click", budAnzeigen);

budAnzeigen();
