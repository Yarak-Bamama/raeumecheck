// Encapsulates all access to localStorage. Desk data lives under a single
// key as JSON, while floor plans each get their own key per floor. The
// reason for the split is that a floor plan photo can be several hundred
// kilobytes. Storing it in the same JSON blob as the desk data would mean
// re-serializing that entire image on every keystroke in the wizard, which
// would be noticeably slow.

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
    // If an older version had fewer fields, missing ones are backfilled
    // with the defaults here instead of the app crashing.
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
