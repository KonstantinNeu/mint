// Texte für den Reiter Schulden in vier Sprachen
// Muss nach sprache.js und vor einstellungen.js geladen werden.
// {a}, {b}, {n}, {m}, {x} werden beim Anzeigen durch Beträge, Zahlen oder Monate ersetzt.

Object.assign(TEXTE.de, {
  nav_schulden: "Schulden",
  sch_hinweis: "Lege eine Schuld an, trage deine Zahlungen ein und sieh, wie viel noch offen ist.",
  sch_gesamt_offen: "Noch offen", sch_bezahlt_von: "Bezahlt {a} von {b}", sch_raten_gesamt: "Monatsraten gesamt (Ø): {x}",
  sch_noch_monate: "Noch {n} Monate bei dieser Rate (bis {m})", sch_noch_monat1: "Noch 1 Monat bei dieser Rate (bis {m})",
  sch_abbezahlt: "Abbezahlt!", sch_keine_rate: "Keine Monatsrate festgelegt",
  sch_rate_in: "Monatsrate in", sch_gesamt_in: "Gesamtbetrag in", sch_neu: "Neue Schuld", sch_name_opt: "Name (optional)",
  sch_zahlungen: "Zahlungen", sch_keine_zahlungen: "Noch keine Zahlungen.", sch_rate_aendern: "Monatsrate ändern",
  sch_loeschen: "Schuld löschen", sch_loeschen_frage: "Diese Schuld mit allen Zahlungen löschen?",
  sch_keine: "Noch keine Schulden.", sch_offen_ue: "Schulden offen",
  sa_Kredit: "Kredit", sa_Privatkonkurs: "Privatkonkurs", sa_Kreditkarte: "Kreditkarte", sa_Autokredit: "Autokredit",
  sa_Studienkredit: "Studienkredit", sa_Wohnungskredit: "Wohnungs- oder Hauskredit", "sa_Überziehung": "Überziehung",
  sa_Steuerschuld: "Steuerschuld", sa_Privatdarlehen: "Privatdarlehen (Familie, Freunde)", sa_Ratenkauf: "Ratenkauf",
  sa_Sonstiges: "Sonstiges"
});

Object.assign(TEXTE.en, {
  nav_schulden: "Debts",
  sch_hinweis: "Add a debt, enter your payments and see how much is still owed.",
  sch_gesamt_offen: "Still owed", sch_bezahlt_von: "Paid {a} of {b}", sch_raten_gesamt: "Total monthly payments (avg.): {x}",
  sch_noch_monate: "{n} months left at this rate (until {m})", sch_noch_monat1: "1 month left at this rate (until {m})",
  sch_abbezahlt: "Paid off!", sch_keine_rate: "No monthly payment set",
  sch_rate_in: "Monthly payment in", sch_gesamt_in: "Total amount in", sch_neu: "New debt", sch_name_opt: "Name (optional)",
  sch_zahlungen: "Payments", sch_keine_zahlungen: "No payments yet.", sch_rate_aendern: "Change monthly payment",
  sch_loeschen: "Delete debt", sch_loeschen_frage: "Delete this debt with all payments?",
  sch_keine: "No debts yet.", sch_offen_ue: "Debts outstanding",
  sa_Kredit: "Loan", sa_Privatkonkurs: "Personal bankruptcy", sa_Kreditkarte: "Credit card", sa_Autokredit: "Car loan",
  sa_Studienkredit: "Student loan", sa_Wohnungskredit: "Home loan", "sa_Überziehung": "Overdraft",
  sa_Steuerschuld: "Tax debt", sa_Privatdarlehen: "Private loan (family, friends)", sa_Ratenkauf: "Installment purchase",
  sa_Sonstiges: "Other"
});

Object.assign(TEXTE.it, {
  nav_schulden: "Debiti",
  sch_hinweis: "Aggiungi un debito, inserisci i tuoi pagamenti e vedi quanto resta da pagare.",
  sch_gesamt_offen: "Ancora da pagare", sch_bezahlt_von: "Pagato {a} di {b}", sch_raten_gesamt: "Rate mensili totali (media): {x}",
  sch_noch_monate: "Ancora {n} mesi con questa rata (fino a {m})", sch_noch_monat1: "Ancora 1 mese con questa rata (fino a {m})",
  sch_abbezahlt: "Estinto!", sch_keine_rate: "Nessuna rata mensile impostata",
  sch_rate_in: "Rata mensile in", sch_gesamt_in: "Importo totale in", sch_neu: "Nuovo debito", sch_name_opt: "Nome (facoltativo)",
  sch_zahlungen: "Pagamenti", sch_keine_zahlungen: "Nessun pagamento.", sch_rate_aendern: "Cambia rata mensile",
  sch_loeschen: "Elimina debito", sch_loeschen_frage: "Eliminare questo debito con tutti i pagamenti?",
  sch_keine: "Nessun debito.", sch_offen_ue: "Debiti residui",
  sa_Kredit: "Prestito", sa_Privatkonkurs: "Fallimento personale", sa_Kreditkarte: "Carta di credito", sa_Autokredit: "Prestito auto",
  sa_Studienkredit: "Prestito studentesco", sa_Wohnungskredit: "Mutuo", "sa_Überziehung": "Scoperto",
  sa_Steuerschuld: "Debito fiscale", sa_Privatdarlehen: "Prestito privato (famiglia, amici)", sa_Ratenkauf: "Acquisto a rate",
  sa_Sonstiges: "Altro"
});

Object.assign(TEXTE.fr, {
  nav_schulden: "Dettes",
  sch_hinweis: "Ajoutez une dette, saisissez vos paiements et voyez combien il reste à payer.",
  sch_gesamt_offen: "Reste à payer", sch_bezahlt_von: "Payé {a} sur {b}", sch_raten_gesamt: "Total des mensualités (moy.) : {x}",
  sch_noch_monate: "Encore {n} mois à ce rythme (jusqu'à {m})", sch_noch_monat1: "Encore 1 mois à ce rythme (jusqu'à {m})",
  sch_abbezahlt: "Remboursé !", sch_keine_rate: "Aucune mensualité définie",
  sch_rate_in: "Mensualité en", sch_gesamt_in: "Montant total en", sch_neu: "Nouvelle dette", sch_name_opt: "Nom (facultatif)",
  sch_zahlungen: "Paiements", sch_keine_zahlungen: "Aucun paiement.", sch_rate_aendern: "Modifier la mensualité",
  sch_loeschen: "Supprimer la dette", sch_loeschen_frage: "Supprimer cette dette avec tous les paiements ?",
  sch_keine: "Aucune dette.", sch_offen_ue: "Dettes restantes",
  sa_Kredit: "Crédit", sa_Privatkonkurs: "Faillite personnelle", sa_Kreditkarte: "Carte de crédit", sa_Autokredit: "Crédit auto",
  sa_Studienkredit: "Prêt étudiant", sa_Wohnungskredit: "Crédit immobilier", "sa_Überziehung": "Découvert",
  sa_Steuerschuld: "Dette fiscale", sa_Privatdarlehen: "Prêt privé (famille, amis)", sa_Ratenkauf: "Paiement échelonné",
  sa_Sonstiges: "Autre"
});
