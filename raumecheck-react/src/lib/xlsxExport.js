import * as XLSX from "xlsx";
import { EXPORT_HEADER, tableToRowValues } from "./tsv";

export const DEFAULT_SHEET_NAME = "Ausstattungscheck";

// Baut nur das Tabellenblatt aus allen erfassten Tischen. Die Spaltenbreiten
// sind grob an die erwarteten Inhalte angepasst, damit die Datei nicht mit
// winzigen, abgeschnittenen Spalten aufgeht, wenn man sie öffnet.
function buildWorksheet(entries) {
  const rows = [EXPORT_HEADER, ...entries.map(({ roomId, table }) => tableToRowValues(roomId, table))];
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 11 },
    { wch: 11 },
    { wch: 13 },
    { wch: 13 },
    { wch: 13 },
    { wch: 13 },
    { wch: 16 },
    { wch: 9 },
    { wch: 34 },
  ];
  return worksheet;
}

// Baut aus allen erfassten Tischen eine Excel-Datei und stößt den Download
// im Browser an.
export function exportToXlsx(entries) {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, buildWorksheet(entries), DEFAULT_SHEET_NAME);

  const today = new Date();
  const stamp = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  XLSX.writeFile(workbook, `Raeumecheck_${stamp}.xlsx`);
}

// Liest die schon vorhandene Arbeitsmappe aus einer verknüpften Datei, damit
// beim automatischen Schreiben andere Tabellenblätter darin erhalten
// bleiben. Gibt null zurück, wenn die Datei leer oder noch kein gültiges
// Excel-Format ist (z. B. weil sie gerade erst angelegt wurde).
export async function readWorkbookFromHandle(handle) {
  const file = await handle.getFile();
  if (file.size === 0) return null;
  const buffer = await file.arrayBuffer();
  try {
    return XLSX.read(buffer, { type: "array" });
  } catch {
    return null;
  }
}

// Schreibt die aktuellen Tischdaten in genau ein Blatt der verknüpften
// Datei, ohne die anderen Blätter darin anzurühren. Wird vom
// ExcelLinkContext bei jeder Datenänderung automatisch aufgerufen.
export async function writeEntriesToHandle(handle, entries, sheetName) {
  const existing = await readWorkbookFromHandle(handle);
  const worksheet = buildWorksheet(entries);

  const workbook = existing ?? XLSX.utils.book_new();
  if (workbook.SheetNames.includes(sheetName)) {
    workbook.Sheets[sheetName] = worksheet;
  } else {
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const writable = await handle.createWritable();
  await writable.write(buffer);
  await writable.close();
}
