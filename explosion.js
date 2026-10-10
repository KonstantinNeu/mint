// Goldene Explosion für die Start-Animation (Canvas, ohne Zusatzprogramm):
// Druckwellen-Ringe, hunderte Funken mit Leuchtspur und aufsteigende Glut.
// Wird mit starteExplosion(x, y) aus app.js gestartet; x, y = Mittelpunkt des Logos.

(function () {
  const leinwand = document.getElementById("funken");
  if (!leinwand) return;
  const zeichner = leinwand.getContext("2d");

  // hellstes Gold bis warmes Orange-Gold
  const FARBEN = [[255, 246, 208], [243, 220, 147], [212, 165, 55], [255, 190, 90]];

  window.starteExplosion = function (cx, cy) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const breite = window.innerWidth;
    const hoehe = window.innerHeight;
    leinwand.width = breite * dpr;
    leinwand.height = hoehe * dpr;
    zeichner.setTransform(dpr, 0, 0, dpr, 0, 0);

    const funken = [];
    const groesstes = Math.max(breite, hoehe);

    // Hauptexplosion: viele schnelle Funken in alle Richtungen
    for (let i = 0; i < 420; i++) {
      const winkel = Math.random() * Math.PI * 2;
      const tempo = 200 + Math.pow(Math.random(), 1.8) * 1500;
      funken.push({
        x: cx, y: cy,
        vx: Math.cos(winkel) * tempo,
        vy: Math.sin(winkel) * tempo,
        leben: 0.7 + Math.random() * 1.6,
        alter: 0,
        groesse: 0.8 + Math.random() * 2.4,
        farbe: FARBEN[Math.floor(Math.random() * FARBEN.length)],
        schwer: 60 + Math.random() * 180,
        reibung: 1.6 + Math.random() * 1.2
      });
    }

    // Druckwellen: Ringe, die nacheinander nach außen laufen
    const ringe = [
      { start: 0,   dauer: 900,  max: groesstes * 0.9, breite: 18 },
      { start: 120, dauer: 1200, max: groesstes * 1.1, breite: 8 },
      { start: 260, dauer: 1400, max: groesstes * 1.3, breite: 4 }
    ];

    let glutRest = 140; // aufsteigende Glut, die später nachkommt
    const anfang = performance.now();
    let zuletzt = anfang;

    function bild(jetzt) {
      const dt = Math.min((jetzt - zuletzt) / 1000, 0.05);
      zuletzt = jetzt;
      const t = jetzt - anfang;

      zeichner.clearRect(0, 0, breite, hoehe);
      zeichner.globalCompositeOperation = "lighter";
      zeichner.lineCap = "round";

      ringe.forEach(function (r) {
        const p = (t - r.start) / r.dauer;
        if (p < 0 || p > 1) return;
        const weg = 1 - Math.pow(1 - p, 3);
        zeichner.beginPath();
        zeichner.arc(cx, cy, weg * r.max, 0, Math.PI * 2);
        zeichner.lineWidth = r.breite * (1 - p) + 1;
        zeichner.strokeStyle = "rgba(255, 225, 140, " + (0.85 * (1 - p)) + ")";
        zeichner.stroke();
      });

      if (t > 400 && t < 1700 && glutRest > 0) {
        const anzahl = Math.min(glutRest, Math.ceil(dt * 110));
        for (let i = 0; i < anzahl; i++) {
          funken.push({
            x: Math.random() * breite,
            y: hoehe * 0.3 + Math.random() * hoehe * 0.7,
            vx: (Math.random() - 0.5) * 40,
            vy: -(20 + Math.random() * 70),
            leben: 1 + Math.random() * 1.2,
            alter: 0,
            groesse: 0.8 + Math.random() * 1.4,
            farbe: FARBEN[1 + Math.floor(Math.random() * 3)],
            schwer: -10,
            reibung: 0.2
          });
        }
        glutRest -= anzahl;
      }

      for (let i = funken.length - 1; i >= 0; i--) {
        const f = funken[i];
        f.alter += dt;
        if (f.alter >= f.leben) { funken.splice(i, 1); continue; }

        const bremse = Math.max(0, 1 - f.reibung * dt);
        f.vx *= bremse;
        f.vy = f.vy * bremse + f.schwer * dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;

        const p = f.alter / f.leben;
        const hell = Math.pow(1 - p, 1.5);
        const c = f.farbe;
        zeichner.beginPath();
        zeichner.moveTo(f.x - f.vx * 0.035, f.y - f.vy * 0.035);
        zeichner.lineTo(f.x, f.y);
        // erst ein weicher, breiter Schein, dann der helle Kern
        zeichner.strokeStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (hell * 0.25) + ")";
        zeichner.lineWidth = f.groesse * 3.4 * (1 - p * 0.5);
        zeichner.stroke();
        zeichner.strokeStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + hell + ")";
        zeichner.lineWidth = f.groesse * (1 - p * 0.6);
        zeichner.stroke();
      }

      if (t < 3200 && (t < 1800 || funken.length > 0)) {
        requestAnimationFrame(bild);
      } else {
        zeichner.clearRect(0, 0, breite, hoehe);
      }
    }

    requestAnimationFrame(bild);
  };
})();
