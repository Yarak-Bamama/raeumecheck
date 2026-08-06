// Builds the tab-separated text that goes to the clipboard on copy, so it
// can be pasted directly into Excel. The column order here matches the
// Excel export exactly, so both paths produce the same result.

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

// Excel expects cells containing tabs, newlines, or quotes to be wrapped in
// quotes, otherwise the table structure breaks apart on paste. This
// function applies that rule per cell.
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
