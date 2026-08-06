import * as XLSX from "xlsx";
import { EXPORT_HEADER, tableToRowValues } from "./tsv";

// Baut aus allen erfassten Tischen eine Excel-Datei und stößt den Download
// im Browser an. Die Spaltenbreiten sind grob an die erwarteten Inhalte
// angepasst, damit die Datei nicht mit winzigen, abgeschnittenen Spalten
// aufgeht, wenn man sie öffnet.
export function exportToXlsx(entries) {
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

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ausstattungscheck");

  const today = new Date();
  const stamp = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  XLSX.writeFile(workbook, `Raeumecheck_${stamp}.xlsx`);
}
