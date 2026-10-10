// Begrüßungen, Sprüche und Namensfragen in vier Sprachen
// Muss nach sprache.js geladen werden. Die Listen sind in allen Sprachen gleich lang und gleich geordnet:
// Platz 3 in "de" entspricht Platz 3 in "en", "it" und "fr". Dadurch bleibt der Spruch derselbe,
// wenn man die Sprache wechselt. {name} wird durch den Namen ersetzt.

Object.assign(TEXTE.de, {
  name_ph: "Dein Name", weiter: "Weiter", willkommen_skip: "Lieber nicht verraten",
  einst_name: "Dein Name", name_speichern: "Speichern"
});
Object.assign(TEXTE.en, {
  name_ph: "Your name", weiter: "Continue", willkommen_skip: "Rather not say",
  einst_name: "Your name", name_speichern: "Save"
});
Object.assign(TEXTE.it, {
  name_ph: "Il tuo nome", weiter: "Avanti", willkommen_skip: "Preferisco non dirlo",
  einst_name: "Il tuo nome", name_speichern: "Salva"
});
Object.assign(TEXTE.fr, {
  name_ph: "Ton prénom", weiter: "Continuer", willkommen_skip: "Je préfère ne pas dire",
  einst_name: "Ton prénom", name_speichern: "Enregistrer"
});

// Fragen, die beim allerersten Start nach dem Namen fragen (eine wird zufällig gewählt)
const NAMENSFRAGEN = {
  de: [
    "Um wessen Finanzen geht es hier eigentlich?",
    "Wer ist der Glückliche, dessen Konto wir heute durchleuchten?",
    "Wem gehört das ganze Geld, von dem hier gleich die Rede ist?",
    "Wessen Konto darf heute zittern?",
    "Für wen führen wir hier die Bücher?",
    "Wer traut sich, seine Finanzen mit uns anzuschauen?"
  ],
  en: [
    "Whose finances are we actually talking about here?",
    "Who's the lucky one whose account we're about to inspect?",
    "Whose money is all this, anyway?",
    "Whose account gets to tremble today?",
    "Who are we keeping the books for?",
    "Who dares to look at their finances with us?"
  ],
  it: [
    "Di chi sono le finanze di cui parliamo qui?",
    "Chi è il fortunato di cui esamineremo il conto?",
    "Di chi sono tutti questi soldi, in fondo?",
    "Il conto di chi può tremare oggi?",
    "Per chi teniamo i libri contabili?",
    "Chi ha il coraggio di guardare le proprie finanze con noi?"
  ],
  fr: [
    "De qui sont les finances dont on parle ici ?",
    "Qui est l'heureux élu dont on va éplucher le compte ?",
    "À qui appartient tout cet argent, au fait ?",
    "Le compte de qui a le droit de trembler aujourd'hui ?",
    "Pour qui tient-on les comptes ici ?",
    "Qui ose regarder ses finances avec nous ?"
  ]
};

// Begrüßungen für die Übersicht (20 Stück, eine wird zufällig gewählt)
const BEGRUESSUNGEN = {
  de: [
    "Hallo {name}", "Servus {name}", "Moin {name}", "Na, {name}?", "Da bist du ja, {name}",
    "Willkommen zurück, {name}", "Grüß dich, {name}", "Hey {name}", "Schön, dich zu sehen, {name}",
    "Hallo {name}, wieder mal unterwegs?", "Guten Tag, {name}", "Hi {name}", "Ahoi {name}", "Tag {name}",
    "Na du, {name}", "Hallo {name}, die Zahlen warten schon", "Auch schon da, {name}?", "Tach {name}",
    "Hallo {name}, bereit für die Wahrheit?", "Schön, dass du da bist, {name}"
  ],
  en: [
    "Hello {name}", "Hey {name}", "Howdy {name}", "Well, {name}?", "There you are, {name}",
    "Welcome back, {name}", "Good to see you, {name}", "Hi {name}", "Nice to see you, {name}",
    "Hello {name}, back again?", "Good day, {name}", "Hi there {name}", "Ahoy {name}", "Greetings {name}",
    "Oh hello, {name}", "Hello {name}, the numbers are waiting", "Finally here, {name}?", "Yo {name}",
    "Hello {name}, ready for the truth?", "Glad you're here, {name}"
  ],
  it: [
    "Ciao {name}", "Ehi {name}", "Salve {name}", "Allora, {name}?", "Eccoti, {name}",
    "Rieccoti, {name}", "Che piacere, {name}", "Ciao ciao {name}", "Piacere di vederti, {name}",
    "Ciao {name}, di nuovo qui?", "Salute a te, {name}", "Ehilà {name}", "Ohé {name}", "Saluti, {name}",
    "Oh, ciao {name}", "Ciao {name}, i numeri ti aspettano", "Finalmente, {name}?", "Buondì {name}",
    "Ciao {name}, è ora della verità", "Felice di averti qui, {name}"
  ],
  fr: [
    "Bonjour {name}", "Salut {name}", "Coucou {name}", "Alors, {name} ?", "Te voilà, {name}",
    "Ça fait plaisir de te revoir, {name}", "Bienvenue, {name}", "Hé {name}", "Ça fait plaisir de te voir, {name}",
    "Bonjour {name}, de retour ?", "Salutations, {name}", "Allô {name}", "Ohé {name}", "Bonne journée, {name}",
    "Tiens, {name}", "Bonjour {name}, les chiffres t'attendent", "Enfin là, {name} ?", "Salut salut {name}",
    "Bonjour {name}, l'heure de vérité a sonné", "Quel plaisir de t'avoir ici, {name}"
  ]
};

// Sprüche zum Thema Geld (26 Stück). Die ersten 18 passen immer, die letzten 8 nur zu bestimmten Zeiten (siehe SPRUCH_ZEIT)
const SPRUECHE = {
  de: [
    "Schon im Lotto gewonnen? Nein? Dann machen wir halt weiter wie bisher.",
    "Der Kontostand ist wie das Wetter: Man kann ihn beobachten, aber nicht viel dagegen tun.",
    "Heute schon etwas gekauft, das du nicht gebraucht hast? Keine Sorge, wir sagen es niemandem.",
    "Dein Geld hat keine Beine, aber es läuft trotzdem ständig weg.",
    "Ein Cent hier, ein Cent da – und plötzlich ist der Monat vorbei.",
    "Sparen ist wie Sport: Alle wollen es, aber morgen fangen wir an.",
    "Das Abo, das du vergessen hast, hat dich nicht vergessen.",
    "Zahlen lügen nicht. Sie sind nur manchmal sehr unhöflich.",
    "Der Monat hat 30 Tage. Das Geld war oft nur für 20 davon eingeplant.",
    "Kaffee to go ist auch nur die Miete für einen Pappbecher.",
    "Schon auf dein Konto geschaut? Mut ist eine Tugend.",
    "Ein Budget heißt, dem Geld zu sagen, wohin es soll, bevor es selbst entscheidet.",
    "Dein Konto ist wie ein Kühlschrank: Wenn man es öfter aufmacht, wird es nicht voller.",
    "Wer rechnet, gewinnt. Wer nur schätzt, wundert sich.",
    "Rücklagen sind Geld, das Urlaub vom Ausgeben macht.",
    "Spontankäufe sind Rechnungen, die sich als Überraschung tarnen.",
    "Dein zukünftiges Ich sagt Danke. Dein jetziges Ich ist nur kurz beleidigt.",
    "Wohin ist das Geld verschwunden? Keine Sorge, genau dafür gibt es diese App.",
    "Na Gott sei Dank ist bald Weihnachten. Dein Konto freut sich schon.",
    "Geschenke gekauft? Dein Konto fragt nur mal so.",
    "Neues Jahr, neue Vorsätze. Dein Konto hat sie schon gehört.",
    "Montag. Auch dein Konto hat noch keine Lust.",
    "Es ist Freitag. Das Wochenende kostet übrigens extra.",
    "Sommer! Eis, Urlaub und Kontoauszüge, die man lieber nicht ansieht.",
    "Februar: Blumen kosten gerade doppelt. Zufall.",
    "Steuerausgleich nicht vergessen – das Finanzamt vergisst dich auch nicht."
  ],
  en: [
    "Won the lottery yet? No? Then let's carry on as usual.",
    "Your balance is like the weather: you can watch it, but there's not much you can do about it.",
    "Bought something today you didn't need? Don't worry, we won't tell anyone.",
    "Your money has no legs, but it keeps running away anyway.",
    "A cent here, a cent there – and suddenly the month is over.",
    "Saving is like exercise: everyone wants it, but we start tomorrow.",
    "The subscription you forgot hasn't forgotten you.",
    "Numbers don't lie. They're just sometimes very rude.",
    "The month has 30 days. The money was often planned for only 20 of them.",
    "Coffee to go is just renting a paper cup.",
    "Looked at your account today? Courage is a virtue.",
    "A budget means telling your money where to go before it decides on its own.",
    "Your account is like a fridge: opening it more often doesn't fill it.",
    "Those who calculate win. Those who only guess get surprised.",
    "Savings are money taking a holiday from being spent.",
    "Impulse buys are bills disguised as surprises.",
    "Your future self says thank you. Your present self is only briefly offended.",
    "Where did the money go? Don't worry, that's exactly what this app is for.",
    "Thank goodness Christmas is coming soon. Your account is already looking forward to it.",
    "Gifts bought? Your account is just asking.",
    "New year, new resolutions. Your account has already heard them.",
    "Monday. Your account isn't in the mood yet either.",
    "It's Friday. The weekend costs extra, by the way.",
    "Summer! Ice cream, holidays and statements you'd rather not look at.",
    "February: flowers cost double right now. Coincidence.",
    "Don't forget your tax return – the tax office won't forget you either."
  ],
  it: [
    "Hai già vinto alla lotteria? No? Allora andiamo avanti come sempre.",
    "Il saldo è come il meteo: puoi guardarlo, ma non puoi farci molto.",
    "Hai comprato oggi qualcosa che non ti serviva? Nessun problema, non lo diciamo a nessuno.",
    "Il tuo denaro non ha gambe, ma scappa comunque di continuo.",
    "Un centesimo qui, un centesimo là – e all'improvviso il mese è finito.",
    "Risparmiare è come fare sport: lo vogliono tutti, ma si comincia domani.",
    "L'abbonamento che hai dimenticato non ha dimenticato te.",
    "I numeri non mentono. A volte sono solo molto maleducati.",
    "Il mese ha 30 giorni. I soldi erano spesso pianificati solo per 20.",
    "Il caffè da asporto è solo l'affitto di un bicchiere di carta.",
    "Hai guardato il conto oggi? Il coraggio è una virtù.",
    "Un budget significa dire ai soldi dove andare prima che decidano da soli.",
    "Il conto è come un frigorifero: aprirlo più spesso non lo riempie.",
    "Chi calcola vince. Chi stima soltanto resta sorpreso.",
    "I risparmi sono soldi che fanno una vacanza dallo spendere.",
    "Gli acquisti d'impulso sono bollette travestite da sorprese.",
    "Il tuo io futuro dice grazie. Il tuo io di adesso è offeso solo per un attimo.",
    "Dove sono finiti i soldi? Niente paura, per questo esiste questa app.",
    "Per fortuna manca poco a Natale. Il tuo conto non vede l'ora.",
    "Regali comprati? Il tuo conto chiede solo così, per sapere.",
    "Anno nuovo, buoni propositi. Il tuo conto li ha già sentiti.",
    "Lunedì. Neanche il tuo conto ha voglia.",
    "È venerdì. A proposito, il weekend costa extra.",
    "Estate! Gelati, vacanze ed estratti conto che preferiresti non guardare.",
    "Febbraio: i fiori costano il doppio proprio adesso. Che caso.",
    "Non dimenticare la dichiarazione dei redditi – il fisco non dimentica te."
  ],
  fr: [
    "Déjà gagné au loto ? Non ? Alors on continue comme d'habitude.",
    "Le solde, c'est comme la météo : on peut l'observer, mais on n'y peut pas grand-chose.",
    "Tu as acheté quelque chose dont tu n'avais pas besoin ? Pas de souci, on ne dira rien.",
    "Ton argent n'a pas de jambes, mais il file quand même sans arrêt.",
    "Un centime ici, un centime là – et soudain le mois est fini.",
    "Épargner, c'est comme le sport : tout le monde veut, mais on commence demain.",
    "L'abonnement que tu as oublié ne t'a pas oublié.",
    "Les chiffres ne mentent pas. Ils sont juste parfois très impolis.",
    "Le mois a 30 jours. L'argent n'en avait souvent prévu que 20.",
    "Le café à emporter, c'est juste la location d'un gobelet en carton.",
    "Tu as regardé ton compte aujourd'hui ? Le courage est une vertu.",
    "Un budget, c'est dire à l'argent où aller avant qu'il décide tout seul.",
    "Ton compte est comme un frigo : l'ouvrir plus souvent ne le remplit pas.",
    "Celui qui calcule gagne. Celui qui devine se fait surprendre.",
    "L'épargne, c'est de l'argent qui prend des vacances de la dépense.",
    "Les achats impulsifs sont des factures déguisées en surprises.",
    "Ton futur toi dit merci. Ton toi actuel est vexé juste un instant.",
    "Où est passé l'argent ? Pas de panique, c'est exactement pour ça que cette appli existe.",
    "Heureusement, Noël approche. Ton compte s'en réjouit déjà.",
    "Cadeaux achetés ? Ton compte demande juste comme ça.",
    "Nouvelle année, bonnes résolutions. Ton compte les a déjà entendues.",
    "Lundi. Ton compte n'a pas encore envie non plus.",
    "C'est vendredi. Le week-end coûte en plus, d'ailleurs.",
    "L'été ! Glaces, vacances et relevés qu'on préfère ne pas regarder.",
    "Février : les fleurs coûtent le double en ce moment. Hasard.",
    "N'oublie pas ta déclaration d'impôts – le fisc ne t'oublie pas non plus."
  ]
};

// Wann ein Spruch erscheinen darf (gleiche Reihenfolge wie SPRUECHE). null = immer.
// monate: 1 = Januar ... 12 = Dezember, tage: 0 = Sonntag ... 6 = Samstag
const SPRUCH_ZEIT = [
  null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
  { monate: [11] },          // Weihnachten kommt bald
  { monate: [12] },          // Geschenke
  { monate: [1] },           // Neujahrsvorsätze
  { tage: [1] },             // Montag
  { tage: [5] },             // Freitag
  { monate: [6, 7, 8] },     // Sommer
  { monate: [2] },           // Blumen im Februar
  { monate: [3, 4] }         // Steuerausgleich
];
