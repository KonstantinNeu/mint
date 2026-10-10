// Modul App-Sperre: 4-stellige PIN beim Öffnen der App
// Gespeichert wird nicht die PIN selbst, sondern nur ein "Fingerabdruck" (Hash) davon, zusammen mit einem Zufallswert.
// Das hält neugierige Blicke ab, ist aber keine Verschlüsselung der Daten.
// Die Daten bleiben nur auf diesem Gerät (localStorage).

const SP_SPEICHER_NAME = "finanzapp-sperre";
const SP_PAUSE_MS = 60000; // So lange darf die App im Hintergrund sein, bevor wieder die PIN kommt

let spDaten = null; // { salz, hash } oder null, wenn keine PIN festgelegt ist

try {
  const gespeichert = localStorage.getItem(SP_SPEICHER_NAME);
  if (gespeichert) spDaten = JSON.parse(gespeichert);
} catch (fehler) { /* ohne Speicher weiterarbeiten */ }

function spSpeichern() {
  try {
    if (spDaten) localStorage.setItem(SP_SPEICHER_NAME, JSON.stringify(spDaten));
    else localStorage.removeItem(SP_SPEICHER_NAME);
  } catch (fehler) { }
}

// Einfacher Hash (cyrb53) aus Zufallswert und PIN
function spHash(pin, salz) {
  const text = salz + ":" + pin;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const zeichen = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ zeichen, 2654435761);
    h2 = Math.imul(h2 ^ zeichen, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

const spFeld = document.getElementById("sperre");
const spTitel = document.getElementById("sp-titel");
const spPunkte = document.querySelectorAll("#sp-punkte span");
const spMeldung = document.getElementById("sp-meldung");
const spAbbrechen = document.getElementById("sp-abbrechen");

// Modus: "entsperren" (PIN beim Öffnen), "alt" (alte PIN vor Ändern/Entfernen), "neu" (neue PIN wählen), "wiederholen" (neue PIN bestätigen)
let spModus = "entsperren";
let spEingabe = "";
let spErste = "";
let spDanach = null; // wird nach richtiger PIN aufgerufen

const SP_TITEL = { entsperren: "sp_eingeben", alt: "sp_eingeben", neu: "sp_neu", wiederholen: "sp_wiederholen" };

function spZeichnen() {
  spTitel.textContent = t(SP_TITEL[spModus]);
  spTasten.lastChild.setAttribute("aria-label", t("sp_ziffer_loeschen"));
  spPunkte.forEach(function (punkt, i) { punkt.classList.toggle("voll", i < spEingabe.length); });
}

function spZeigen(modus, danach) {
  spModus = modus;
  spDanach = danach || null;
  spEingabe = "";
  spErste = "";
  spMeldung.textContent = "";
  spAbbrechen.hidden = modus === "entsperren";
  spZeichnen();
  spFeld.hidden = false;
}

function spSchliessen() {
  spFeld.hidden = true;
  spEingabe = "";
}

function spMeldungZeigen(textSchluessel) {
  spMeldung.textContent = t(textSchluessel);
  spFeld.classList.remove("wackeln");
  void spFeld.offsetWidth; // Animation neu starten
  spFeld.classList.add("wackeln");
}

function spPruefen() {
  const pin = spEingabe;
  spEingabe = "";

  if (spModus === "neu") {
    spErste = pin;
    spModus = "wiederholen";
  } else if (spModus === "wiederholen") {
    if (pin !== spErste) {
      spModus = "neu";
      spErste = "";
      spZeichnen();
      spMeldungZeigen("sp_ungleich");
      return;
    }
    const salz = Math.random().toString(36).slice(2);
    spDaten = { salz: salz, hash: spHash(pin, salz) };
    spSpeichern();
    spSchliessen();
    spStatusZeichnen();
    return;
  } else if (spHash(pin, spDaten.salz) === spDaten.hash) {
    const danach = spDanach;
    spSchliessen();
    if (danach) danach();
    return;
  } else {
    spZeichnen();
    spMeldungZeigen("sp_falsch");
    return;
  }
  spZeichnen();
}

function spZiffer(ziffer) {
  if (spEingabe.length >= 4) return;
  spMeldung.textContent = "";
  spEingabe += ziffer;
  spZeichnen();
  if (spEingabe.length === 4) setTimeout(spPruefen, 150);
}

function spLoeschen() {
  spEingabe = spEingabe.slice(0, -1);
  spZeichnen();
}

// Zahlentastatur aufbauen
const spTasten = document.getElementById("sp-tasten");
["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].forEach(function (zeichen) {
  const taste = document.createElement("button");
  taste.type = "button";
  if (zeichen === "") {
    taste.className = "leer";
    taste.disabled = true;
  } else if (zeichen === "⌫") {
    taste.textContent = zeichen;
    taste.setAttribute("aria-label", t("sp_ziffer_loeschen"));
    taste.addEventListener("click", spLoeschen);
  } else {
    taste.textContent = zeichen;
    taste.addEventListener("click", function () { spZiffer(zeichen); });
  }
  spTasten.append(taste);
});

// Auch mit der Tastatur am PC bedienbar
document.addEventListener("keydown", function (e) {
  if (spFeld.hidden) return;
  if (e.key >= "0" && e.key <= "9" && e.key.length === 1) spZiffer(e.key);
  else if (e.key === "Backspace") spLoeschen();
});

spAbbrechen.addEventListener("click", spSchliessen);

// Einstellungen: Anzeige und Knöpfe
function spStatusZeichnen() {
  document.getElementById("sp-status").textContent = t(spDaten ? "sp_an" : "sp_aus");
  document.getElementById("sp-festlegen").textContent = t(spDaten ? "sp_aendern" : "sp_festlegen");
  document.getElementById("sp-entfernen").hidden = !spDaten;
}

document.getElementById("sp-festlegen").addEventListener("click", function () {
  if (spDaten) spZeigen("alt", function () { spZeigen("neu"); });
  else spZeigen("neu");
});

document.getElementById("sp-entfernen").addEventListener("click", function () {
  if (!spDaten) return;
  spZeigen("alt", function () {
    spDaten = null;
    spSpeichern();
    spStatusZeichnen();
  });
});

// Kam die App länger als eine Minute aus dem Hintergrund zurück, kommt wieder die PIN
let spVersteckt = 0;
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    spVersteckt = Date.now();
  } else if (spDaten && spFeld.hidden && spVersteckt && Date.now() - spVersteckt > SP_PAUSE_MS) {
    spZeigen("entsperren");
  }
});

spStatusZeichnen();

// Beim Öffnen der App: gleich sperren (der Sperrbildschirm liegt unter der Start-Animation)
if (spDaten) spZeigen("entsperren");
