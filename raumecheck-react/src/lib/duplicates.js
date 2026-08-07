// Warnt, wenn eine Inventarnummer schon bei einem anderen Tisch erfasst
// wurde, meistens ein Zeichen für einen Zahlendreher oder ein versehentlich
// doppelt erfasstes Gerät. Häufige Platzhaltertexte wie "nicht da" lösen
// bewusst keine Warnung aus, weil die naturgemäß oft mehrfach vorkommen.
const PLACEHOLDER_VALUES = new Set([
  "nicht da",
  "keine",
  "kein",
  "hat keine",
  "entfällt",
  "kein pickerl",
  "n/a",
  "-",
  "standrechner",
]);

function isCheckableValue(value) {
  const normalized = value?.trim().toLowerCase() ?? "";
  return normalized.length >= 3 && !PLACEHOLDER_VALUES.has(normalized);
}

export function findDuplicates(rooms, fieldKey, value, exclude = {}) {
  if (!isCheckableValue(value)) return [];
  const normalized = value.trim().toLowerCase();
  const matches = [];

  for (const [roomId, room] of Object.entries(rooms)) {
    for (const table of room.tables) {
      if (roomId === exclude.roomId && table.id === exclude.tableId) continue;
      if ((table[fieldKey] ?? "").trim().toLowerCase() === normalized) {
        matches.push({ roomId, tischNr: table.tischNr });
      }
    }
  }

  return matches;
}

export function describeDuplicates(matches) {
  if (!matches.length) return null;
  const locations = matches
    .map((match) => `${match.roomId}${match.tischNr ? ` (${match.tischNr})` : ""}`)
    .join(", ");
  return `Schon erfasst bei: ${locations}`;
}
