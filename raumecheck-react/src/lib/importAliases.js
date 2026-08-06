// So import still works when the header row in the uploaded file doesn't
// exactly match our own export ("Stehtisch-Nr (STXXXX)" instead of
// "Tisch-Nr", for example), each column is checked against a list of
// possible labels. Matching looks for these terms as a substring within the
// normalized header cell, not as an exact match, so extras like parentheses
// or units don't prevent a match.

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
