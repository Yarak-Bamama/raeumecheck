// Speichert das Datei-Handle für die verknüpfte Excel-Datei dauerhaft, sowie
// den Namen des Tabellenblatts, in das geschrieben werden soll. Ein
// FileSystemFileHandle lässt sich nicht als Text in localStorage ablegen,
// deshalb landet beides stattdessen in einer eigenen kleinen IndexedDB-
// Datenbank.
const DB_NAME = "raumcheck_files";
const STORE_NAME = "handles";
const HANDLE_KEY = "excelFile";
const SHEET_KEY = "excelSheetName";

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runTransaction(mode, work) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const result = work(tx.objectStore(STORE_NAME));
    tx.oncomplete = () => resolve(result?.result);
    tx.onerror = () => reject(tx.error);
  });
}

export function storeFileHandle(handle) {
  return runTransaction("readwrite", (store) => store.put(handle, HANDLE_KEY));
}

export function getStoredFileHandle() {
  return runTransaction("readonly", (store) => store.get(HANDLE_KEY));
}

export function clearStoredFileHandle() {
  return runTransaction("readwrite", (store) => {
    store.delete(HANDLE_KEY);
    store.delete(SHEET_KEY);
  });
}

export function storeSheetName(name) {
  return runTransaction("readwrite", (store) => store.put(name, SHEET_KEY));
}

export function getStoredSheetName() {
  return runTransaction("readonly", (store) => store.get(SHEET_KEY));
}
