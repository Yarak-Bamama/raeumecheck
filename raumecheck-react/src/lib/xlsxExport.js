import * as XLSX from "xlsx";
import { EXPORT_HEADER, tableToRowValues } from "./tsv";

// Builds an Excel file from all captured desks and triggers the download in
// the browser. Column widths are roughly matched to the expected content so
// the file doesn't open with tiny, truncated columns.
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
