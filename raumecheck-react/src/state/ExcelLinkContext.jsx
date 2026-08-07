import { createContext, useEffect, useRef, useState } from "react";
import {
  clearStoredFileHandle,
  getStoredFileHandle,
  getStoredSheetName,
  storeFileHandle,
  storeSheetName,
} from "../lib/excelFileHandle";
import { DEFAULT_SHEET_NAME, readWorkbookFromHandle, writeEntriesToHandle } from "../lib/xlsxExport";
import { allTableEntries } from "./selectors";
import { useAppState } from "./useAppState";
import { useToast } from "../components/toast/useToast";

export const ExcelLinkContext = createContext(null);

const isSupported = typeof window !== "undefined" && "showSaveFilePicker" in window;

const XLSX_FILE_TYPES = [
  {
    description: "Excel-Datei",
    accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
  },
];

const WRITE_FAIL_HINT =
  " Ist die Datei gerade in Excel geöffnet? Bitte dort schließen und nochmal versuchen.";

function describeError(error) {
  const detail = error?.message || error?.name;
  return detail ? ` (${detail})` : "";
}

// Hält das Datei-Handle für eine mit dem Betriebssystem verknüpfte
// Excel-Datei und schreibt bei jeder Änderung an den Tischdaten automatisch
// die aktuelle Tabelle in das gewählte Blatt darin, ohne andere Blätter in
// derselben Datei anzurühren. So muss niemand mehr manuell kopieren oder
// exportieren, sobald einmal eine Datei und ein Blatt ausgewählt wurden.
// Der Browser verlangt aus Sicherheitsgründen nach einem Neustart eventuell
// eine erneute Bestätigung per Klick, das lässt sich nicht automatisieren.
export function ExcelLinkProvider({ children }) {
  const { state } = useAppState();
  const toast = useToast();
  const [handle, setHandle] = useState(null);
  const [sheetName, setSheetName] = useState(null);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [isReady, setIsReady] = useState(!isSupported);
  const [pendingChoice, setPendingChoice] = useState(null);
  const writeTimer = useRef(null);
  const lastWriteFailed = useRef(false);
  const pendingHandleRef = useRef(null);

  useEffect(() => {
    if (!isSupported) return;
    (async () => {
      const [storedHandle, storedSheet] = await Promise.all([getStoredFileHandle(), getStoredSheetName()]);
      if (storedHandle) {
        const permission = await storedHandle.queryPermission({ mode: "readwrite" });
        setHandle(storedHandle);
        setSheetName(storedSheet ?? DEFAULT_SHEET_NAME);
        setNeedsPermission(permission !== "granted");
      }
      setIsReady(true);
    })();
  }, []);

  const entries = allTableEntries(state.rooms);
  const entriesKey = JSON.stringify(entries);

  useEffect(() => {
    if (!isReady || !handle || !sheetName || needsPermission) return;
    clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(async () => {
      try {
        await writeEntriesToHandle(handle, entries, sheetName);
        lastWriteFailed.current = false;
      } catch (error) {
        console.error("Räumecheck: Schreiben in verknüpfte Excel-Datei fehlgeschlagen.", error);
        if (!lastWriteFailed.current) {
          toast.show(
            `Automatisches Speichern in die Excel-Datei ist fehlgeschlagen${describeError(error)}.${WRITE_FAIL_HINT}`,
            "warn",
          );
          lastWriteFailed.current = true;
        }
      }
    }, 800);
    return () => clearTimeout(writeTimer.current);
    // entries wird bewusst über entriesKey verglichen, damit sich der Effekt
    // nicht bei jedem Render neu auslöst, nur weil allTableEntries ein neues
    // Array-Objekt mit demselben Inhalt zurückgibt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entriesKey, handle, sheetName, needsPermission, isReady]);

  async function finishLinking(picked, chosenSheetName) {
    await storeFileHandle(picked);
    await storeSheetName(chosenSheetName);
    setHandle(picked);
    setSheetName(chosenSheetName);
    setNeedsPermission(false);
    setPendingChoice(null);
    try {
      await writeEntriesToHandle(picked, entries, chosenSheetName);
      toast.show("Excel-Datei verknüpft. Wird ab jetzt automatisch aktualisiert.", "ok");
    } catch (error) {
      console.error("Räumecheck: Erstes Schreiben in verknüpfte Excel-Datei fehlgeschlagen.", error);
      toast.show(`Verknüpft, aber erstes Schreiben ist fehlgeschlagen${describeError(error)}.${WRITE_FAIL_HINT}`, "warn");
    }
  }

  async function link() {
    let picked;
    try {
      picked = await window.showSaveFilePicker({
        suggestedName: "Raeumecheck.xlsx",
        types: XLSX_FILE_TYPES,
      });
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Räumecheck: Datei auswählen fehlgeschlagen.", error);
        toast.show(`Verknüpfen der Excel-Datei fehlgeschlagen${describeError(error)}.`, "warn");
      }
      return;
    }

    let existing;
    try {
      existing = await readWorkbookFromHandle(picked);
    } catch (error) {
      console.error("Räumecheck: Bestehende Excel-Datei konnte nicht gelesen werden.", error);
      toast.show(`Datei konnte nicht gelesen werden${describeError(error)}.`, "warn");
      return;
    }
    if (existing && existing.SheetNames.length > 0) {
      pendingHandleRef.current = picked;
      setPendingChoice({ sheetNames: existing.SheetNames, currentSheet: null });
      return;
    }

    await finishLinking(picked, DEFAULT_SHEET_NAME);
  }

  async function changeSheet() {
    if (!handle) return;
    const existing = await readWorkbookFromHandle(handle);
    pendingHandleRef.current = handle;
    setPendingChoice({ sheetNames: existing?.SheetNames ?? [], currentSheet: sheetName });
  }

  async function confirmSheetChoice(chosenSheetName) {
    const picked = pendingHandleRef.current;
    pendingHandleRef.current = null;
    if (!picked) return;
    await finishLinking(picked, chosenSheetName);
  }

  function cancelSheetChoice() {
    pendingHandleRef.current = null;
    setPendingChoice(null);
  }

  async function unlink() {
    await clearStoredFileHandle();
    setHandle(null);
    setSheetName(null);
    setNeedsPermission(false);
  }

  async function confirmPermission() {
    if (!handle) return;
    try {
      const permission = await handle.requestPermission({ mode: "readwrite" });
      if (permission === "granted") {
        setNeedsPermission(false);
        await writeEntriesToHandle(handle, entries, sheetName);
        toast.show("Verknüpfung bestätigt.", "ok");
      }
    } catch (error) {
      console.error("Räumecheck: Berechtigung bestätigen fehlgeschlagen.", error);
      toast.show(`Bestätigen fehlgeschlagen${describeError(error)}.`, "warn");
    }
  }

  const value = {
    isSupported,
    isReady,
    isLinked: Boolean(handle),
    fileName: handle?.name ?? null,
    sheetName,
    needsPermission,
    pendingChoice,
    link,
    unlink,
    changeSheet,
    confirmSheetChoice,
    cancelSheetChoice,
    confirmPermission,
  };

  return <ExcelLinkContext.Provider value={value}>{children}</ExcelLinkContext.Provider>;
}
