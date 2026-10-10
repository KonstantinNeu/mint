// Modul Sparziele (im Reiter Sparen): Name und Zielbetrag, das Ersparte füllt die Ziele der Reihe nach
// Nutzt geld(), zuZahl(), bearbeitenKnopf(), eintragBearbeiten() aus einkommen.js und rlStand() aus ruecklage.js.
// Die Daten bleiben nur auf diesem Gerät (localStorage).

const ZIEL_SPEICHER_NAME = "finanzapp-sparziele";

let zielDaten = []; // [{ name: "Urlaub", ziel: 1500 }]

try {
  const gespeichert = localStorage.getItem(ZIEL_SPEICHER_NAME);
  if (gespeichert) zielDaten = JSON.parse(gespeichert);
} catch (fehler) { /* ohne Speicher weiterarbeiten */ }

function zielSpeichern() {
  try { localStorage.setItem(ZIEL_SPEICHER_NAME, JSON.stringify(zielDaten)); } catch (fehler) { }
}

function zielAnzeigen() {
  const liste = document.getElementById("ziel-liste");
  liste.innerHTML = "";

  if (zielDaten.length === 0) {
    const leer = document.createElement("li");
    leer.className = "hinweis";
    leer.textContent = t("ziel_keine");
    liste.append(leer);
    return;
  }

  // Das Ersparte (Gespart gesamt) füllt Ziel für Ziel; was übrig bleibt, geht zum nächsten
  let rest = Math.max(0, rlStand() || 0);

  zielDaten.forEach(function (z) {
    const gefuellt = Math.min(rest, z.ziel);
    rest -= gefuellt;

    const li = document.createElement("li");

    const inhalt = document.createElement("div");
    inhalt.className = "budget-kopf";
    const zeile = document.createElement("div");
    zeile.className = "budget-zeile";
    const name = document.createElement("span");
    name.textContent = z.name;
    const betrag = document.createElement("span");
    betrag.textContent = geld(gefuellt) + " / " + geld(z.ziel);
    zeile.append(name, betrag);

    const balken = document.createElement("div");
    balken.className = "balken";
    balken.append(document.createElement("span"));
    balken.querySelector("span").style.width = (z.ziel > 0 ? gefuellt / z.ziel * 100 : 0) + "%";

    inhalt.append(zeile, balken);
    if (gefuellt >= z.ziel) {
      const geschafft = document.createElement("div");
      geschafft.className = "budget-notiz";
      geschafft.textContent = t("ziel_erreicht");
      inhalt.append(geschafft);
    }

    const bearbeiten = bearbeitenKnopf(function () {
      eintragBearbeiten(li, z.name, [
        { typ: "text", wert: z.name, platzhalter: t("ziel_name_ph") },
        { typ: "betrag", wert: z.ziel }
      ], function (werte) {
        const neuerName = werte[0].trim().slice(0, 30);
        const neuesZiel = zuZahl(werte[1]);
        if (neuerName === "" || neuesZiel === null || neuesZiel <= 0) return false;
        z.name = neuerName;
        z.ziel = neuesZiel;
        zielSpeichern();
        zielAnzeigen();
      }, zielAnzeigen);
    });

    const loeschen = document.createElement("button");
    loeschen.type = "button";
    loeschen.textContent = "×";
    loeschen.setAttribute("aria-label", z.name + " " + t("loeschen"));
    loeschen.addEventListener("click", function () {
      zielDaten = zielDaten.filter(function (x) { return x !== z; });
      zielSpeichern();
      zielAnzeigen();
    });

    li.append(inhalt, bearbeiten, loeschen);
    liste.append(li);
  });
}

document.getElementById("ziel-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("ziel-name").value.trim().slice(0, 30);
  const ziel = zuZahl(document.getElementById("ziel-betrag").value);
  if (name === "" || ziel === null || ziel <= 0) return;
  zielDaten.push({ name: name, ziel: ziel });
  e.target.reset();
  zielSpeichern();
  zielAnzeigen();
});

// Ändert sich das Ersparte, ruft rlAnzeigen() (ruecklage.js) zielAnzeigen() auf
zielAnzeigen();
