import { useContext } from "react";
import { ExcelLinkContext } from "./ExcelLinkContext";

// Gibt Zugriff auf die verknüpfte Excel-Datei: ob eine Verknüpfung besteht,
// ob der Browser erst noch eine Bestätigung braucht, und Funktionen, um sie
// einzurichten, zu bestätigen oder wieder aufzuheben.
export function useExcelLink() {
  const context = useContext(ExcelLinkContext);
  if (!context) {
    throw new Error("useExcelLink muss innerhalb von ExcelLinkProvider verwendet werden.");
  }
  return context;
}
