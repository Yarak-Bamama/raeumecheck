// Baut den Tab-getrennten Text, der beim Kopieren in die Zwischenablage
// wandert, damit er sich direkt in Excel einfügen lässt. Die Spaltenreihen-
// folge hier ist identisch mit der im Excel-Export, damit beide Wege zum
// selben Ergebnis führen.

export const EXPORT_HEADER = [
  "Raumnummer",
  "Tisch-Nr",
  "Laptop-Nr",
  "Monitor1-Nr",
  "Monitor2-Nr",
  "Monitor3-Nr",
  "Dockingstation-Nr",
  "Geprüft?",
  "Anmerkungen",
];

export function tableToRowValues(roomId, table) {
  return [
    roomId,
    table.tischNr,
    table.laptopNr,
    table.monitor1,
    table.monitor2,
    table.monitor3,
    table.dockingNr,
    table.geprueft ? "Ja" : "Nein",
    table.anmerkungen,
  ];
}

// Excel erwartet, dass Zellen mit Tabs, Zeilenumbrüchen oder Anführungs-
// zeichen in Anführungszeichen eingeschlossen werden, sonst zerreißt beim
// Einfügen die Tabellenstruktur. Genau das macht diese Funktion pro Zelle.
function tsvCell(value) {
  const text = value == null ? "" : String(value);
  if (/[\t\n"\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function rowsToTSV(rows) {
  return rows.map((row) => row.map(tsvCell).join("\t")).join("\r\n");
}
