// Kapselt den gesamten Zugriff auf localStorage. Die Tischdaten liegen unter
// einem einzigen Schlüssel als JSON, die Etagenpläne dagegen jeweils unter
// einem eigenen Schlüssel pro Etage. Der Grund für die Trennung ist, dass ein
// Etagenplan als Foto mehrere hundert Kilobyte groß werden kann. Würde man
// ihn im selben JSON-Blob wie die Tischdaten speichern, müsste bei jedem
// Tastendruck im Wizard dieses ganze Bild mit neu serialisiert werden, was
// spürbar langsam wäre.

import { FLOORS } from "./floors";

const STORAGE_KEY = "raumcheck_data_v1";
const MAP_KEY_PREFIX = "raumcheck_map_";

export function defaultState() {
  return {
    rooms: {},
    nicknames: {},
    copiedAt: {},
    session: null,
    currentFloor: FLOORS[0],
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // Falls eine ältere Version weniger Felder kannte, werden fehlende
    // Felder hier mit den Defaults aufgefüllt, statt dass die App abstürzt.
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function getFloorMap(floor) {
  try {
    return localStorage.getItem(MAP_KEY_PREFIX + floor);
  } catch {
    return null;
  }
}

export function setFloorMap(floor, dataUrl) {
  try {
    localStorage.setItem(MAP_KEY_PREFIX + floor, dataUrl);
    return true;
  } catch {
    return false;
  }
}
