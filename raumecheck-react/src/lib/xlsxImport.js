import * as XLSX from "xlsx";
import { floorOfRoomId, FLOORS } from "./floors";
import { IMPORT_FIELD_ALIASES, IMPORT_FIELD_ORDER } from "./importAliases";

function normalizeHeaderCell(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]/g, "");
}

function cellToText(value) {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "Ja" : "Nein";
  return String(value).trim();
}

function parseGeprueftCell(value) {
  if (typeof value === "boolean") return value;
  const text = String(value ?? "").trim().toLowerCase();
  return ["ja", "yes", "true", "1", "x", "✓"].includes(text);
}

// Prüft, ob die erste Zeile der Tabelle wie eine Kopfzeile aussieht, und
// baut dabei gleich die Zuordnung von Spaltenindex zu Feldname. Kommen dabei
// weniger als vier Felder zusammen oder wird gar keine Raumnummer-Spalte
// gefunden, wird die Zeile stattdessen als normale Datenzeile behandelt und
// stattdessen auf die feste Spaltenreihenfolge unseres eigenen Exports
// zurückgefallen.
function detectHeaderColumnMap(row) {
  const normalizedCells = row.map(normalizeHeaderCell);
  const columnMap = {};
  let matchCount = 0;

  for (const field of IMPORT_FIELD_ORDER) {
    const aliases = IMPORT_FIELD_ALIASES[field].map(normalizeHeaderCell);
    const columnIndex = normalizedCells.findIndex(
      (cell) => cell && aliases.some((alias) => cell.includes(alias)),
    );
    if (columnIndex >= 0) {
      columnMap[field] = columnIndex;
      matchCount++;
    }
  }

  if (columnMap.room === undefined || matchCount < 4) return null;
  return columnMap;
}

export function parseImportRows(rows) {
  const nonEmptyRows = rows.filter((row) =>
    row?.some((cell) => cell != null && String(cell).trim() !== ""),
  );
  if (!nonEmptyRows.length) return { entries: [], skipped: 0, unknownFloors: [] };

  const headerMap = detectHeaderColumnMap(nonEmptyRows[0]);
  const dataRows = headerMap ? nonEmptyRows.slice(1) : nonEmptyRows;
  const columnMap =
    headerMap ?? Object.fromEntries(IMPORT_FIELD_ORDER.map((field, index) => [field, index]));

  const entries = [];
  const unknownFloors = new Set();
  let skipped = 0;

  for (const row of dataRows) {
    const roomId = cellToText(row[columnMap.room]);
    if (!roomId) {
      skipped++;
      continue;
    }
    entries.push({
      roomId,
      tischNr: cellToText(row[columnMap.tischNr]),
      laptopNr: cellToText(row[columnMap.laptopNr]),
      monitor1: cellToText(row[columnMap.monitor1]),
      monitor2: cellToText(row[columnMap.monitor2]),
      monitor3: cellToText(row[columnMap.monitor3]),
      dockingNr: cellToText(row[columnMap.dockingNr]),
      geprueft: parseGeprueftCell(row[columnMap.geprueft]),
      anmerkungen: cellToText(row[columnMap.anmerkungen]),
    });
    if (!FLOORS.includes(floorOfRoomId(roomId))) unknownFloors.add(floorOfRoomId(roomId));
  }

  return { entries, skipped, unknownFloors: [...unknownFloors] };
}

// Liest eine hochgeladene Datei ein und liefert die geparsten Zeilen zurück.
// CSV-Dateien werden als Text gelesen, xlsx/xls dagegen als Binärdaten, weil
// SheetJS für beide Fälle einen anderen Lesemodus braucht.
export function readWorkbookFile(file) {
  const isCsv = /\.csv$/i.test(file.name);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden."));
    reader.onload = (event) => {
      let workbook;
      try {
        workbook = isCsv
          ? XLSX.read(event.target.result, { type: "string" })
          : XLSX.read(event.target.result, { type: "array" });
      } catch {
        reject(new Error("Datei konnte nicht gelesen werden (kein gültiges Excel-Format?)."));
        return;
      }
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        reject(new Error("Keine Tabelle in der Datei gefunden."));
        return;
      }
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      resolve(parseImportRows(rows));
    };
    if (isCsv) reader.readAsText(file, "UTF-8");
    else reader.readAsArrayBuffer(file);
  });
}
