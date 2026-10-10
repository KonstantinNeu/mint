// Menü: beim Tippen auf einen Knopf wird die passende Seite gezeigt
const knoepfe = document.querySelectorAll(".menue button[data-seite]");
const seiten = document.querySelectorAll(".seite");
const menue = document.querySelector(".menue");
const menueGriff = document.getElementById("menue-griff");

function menueZu() {
  menue.classList.remove("offen");
  menueGriff.setAttribute("aria-expanded", "false");
}

knoepfe.forEach(function (knopf) {
  knopf.addEventListener("click", function () {
    knoepfe.forEach(function (k) { k.classList.remove("aktiv"); });
    seiten.forEach(function (s) { s.classList.remove("aktiv"); });

    knopf.classList.add("aktiv");
    document.getElementById(knopf.dataset.seite).classList.add("aktiv");

    // Der Griff leuchtet, wenn der offene Reiter im versteckten Bereich liegt; danach klappt er wieder zu
    menueGriff.classList.toggle("hat-aktiv", knopf.closest(".menue-extra") !== null);
    menueZu();
  });
}
);

// Griff: zusätzliche Reiter auf- und zuklappen
menueGriff.addEventListener("click", function () {
  const offen = menue.classList.toggle("offen");
  menueGriff.setAttribute("aria-expanded", offen ? "true" : "false");
});

// Menü nach den Einstellungen aufbauen: Übersicht plus die gewählten Bereiche.
// Bei bis zu 4 Bereichen stehen alle in der Leiste. Sonst stehen die ersten drei dort,
// der Rest klappt über "Mehr" auf. Abgewählte Reiter verschwinden.
function menueAufbauen() {
  const reihenfolge = ["uebersicht", "einkommen", "ausgaben", "fixkosten", "budget", "ruecklage", "schulden", "jahr"];
  const sichtbar = reihenfolge.filter(modulAktiv);
  const zeile = document.querySelector(".menue-zeile");
  const extra = document.getElementById("menue-extra");
  const platz = sichtbar.length <= 4 ? 4 : 3;

  reihenfolge.forEach(function (name) {
    document.querySelector('.menue button[data-seite="' + name + '"]').hidden = sichtbar.indexOf(name) === -1;
  });
  sichtbar.forEach(function (name, i) {
    const knopf = document.querySelector('.menue button[data-seite="' + name + '"]');
    if (i < platz) zeile.insertBefore(knopf, menueGriff);
    else extra.append(knopf);
  });

  menueGriff.hidden = sichtbar.length <= 4;
  if (sichtbar.length <= 4) menueZu();
  menueGriff.classList.toggle("hat-aktiv", extra.querySelector("button.aktiv") !== null);

  // Wurde der gerade offene Bereich abgewählt, geht es zurück zur Übersicht
  const offeneSeite = document.querySelector(".seite.aktiv");
  if (offeneSeite && offeneSeite.id !== "einstellungen" && sichtbar.indexOf(offeneSeite.id) === -1) {
    document.querySelector('.menue button[data-seite="uebersicht"]').click();
  }
}

// Start-Animation: Das M dreht sich, dann wartet das Logo auf einen Tipp.
// Beim Tipp teilt sich das goldene Quadrat und löst sich im Licht auf.
const intro = document.getElementById("intro");

function introEnde() {
  if (intro && intro.parentNode) intro.remove();
  document.body.classList.remove("intro-laeuft", "intro-offen");
  // Beim allerersten Start nach dem Namen fragen
  if (typeof willkommenPruefen === "function") willkommenPruefen();
}

if (intro && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  introEnde(); // Wer Animationen reduziert hat, kommt direkt in die App
} else if (intro) {
  let bereit = false;
  let offen = false;

  // Drehung fertig: das Logo pulsiert und wartet auf den Tipp
  function machBereit() {
    if (bereit) return;
    bereit = true;
    intro.classList.add("bereit");
  }

  function oeffnen() {
    if (offen) return;
    offen = true;
    intro.classList.add("offen");
    document.body.classList.add("intro-offen");

    // Mittelpunkt des Logos: von hier geht die Explosion aus
    const logo = intro.querySelector(".logo").getBoundingClientRect();
    const mitteX = logo.left + logo.width / 2;
    const mitteY = logo.top + logo.height / 2;
    intro.style.setProperty("--cx", mitteX + "px");
    intro.style.setProperty("--cy", mitteY + "px");
    starteExplosion(mitteX, mitteY);

    // Sicherheitsnetz: nach dem Ausblenden (3 Sekunden) die Start-Ebene auf jeden Fall entfernen
    setTimeout(introEnde, 3300);

    // Das goldene Quadrat teilt sich, rutscht ein kleines Stück auseinander und löst sich im Licht auf
    [["links", -1], ["rechts", 1]].forEach(function (paar) {
      const richtung = paar[1];
      const tuer = intro.querySelector(".logo ." + paar[0]);
      const breite = tuer.getBoundingClientRect().width;

      tuer.animate([
        { transform: "translate(0, 0)", opacity: 1, easing: "cubic-bezier(0.1, 0.8, 0.2, 1)" },
        { transform: "translate(" + (richtung * breite * 0.35) + "px, 0)", opacity: 0 }
      ], { duration: 900, fill: "forwards" });
    });
  }

  intro.querySelector(".m-rad").addEventListener("animationend", machBereit);
  intro.addEventListener("animationend", function (e) {
    if (e.animationName === "intro-aus") introEnde();
  });
  intro.addEventListener("click", function () {
    machBereit();
    oeffnen();
  });
}

// Tipp auf das Blatt oder "Mint" in der Kopfzeile: zurück zur Übersicht
function zurZuebersicht() {
  document.querySelector('.menue button[data-seite="uebersicht"]').click();
  window.scrollTo(0, 0);
}

const kopfStart = document.getElementById("kopf-start");
kopfStart.addEventListener("click", zurZuebersicht);
kopfStart.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    zurZuebersicht();
  }
});
