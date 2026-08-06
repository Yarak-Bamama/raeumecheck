// Damit der Import auch dann funktioniert, wenn die Kopfzeile in der
// hochgeladenen Datei nicht exakt so heißt wie unser eigener Export
// ("Stehtisch-Nr (STXXXX)" statt "Tisch-Nr" zum Beispiel), wird jede Spalte
// gegen eine Liste möglicher Bezeichnungen geprüft. Die Erkennung sucht
// diese Begriffe als Teilstring in der normalisierten Kopfzeile, nicht als
// exakte Übereinstimmung, damit auch Zusätze wie Klammern oder Einheiten
// die Zuordnung nicht verhindern.

export const IMPORT_FIELD_ORDER = [
  "room",
  "tischNr",
  "laptopNr",
  "monitor1",
  "monitor2",
  "monitor3",
  "dockingNr",
  "geprueft",
  "anmerkungen",
];

export const IMPORT_FIELD_ALIASES = {
  room: ["raumnummer", "raum", "raumnr", "room", "zimmer", "zimmernummer"],
  tischNr: ["tischnr", "tisch", "stehtisch", "tischnummer", "desk", "tischid"],
  laptopNr: ["laptopnr", "laptop", "laptopnummer", "notebook"],
  monitor1: ["monitor1nr", "monitor1", "monitornr1", "bildschirm1"],
  monitor2: ["monitor2nr", "monitor2", "monitornr2", "bildschirm2"],
  monitor3: ["monitor3nr", "monitor3", "monitornr3", "bildschirm3"],
  dockingNr: ["dockingstationnr", "dockingstation", "docking", "dockingnr"],
  geprueft: ["geprueft", "gepruft", "geprüft", "kontrolliert", "erledigt", "vollstandig", "vollständig"],
  anmerkungen: ["anmerkungen", "anmerkung", "notiz", "notizen", "bemerkung", "kommentar", "notes"],
};
