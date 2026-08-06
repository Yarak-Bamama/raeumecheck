// Alles rund um Etagen und Raumnummern. Ein Raum heißt zum Beispiel
// "E16.M.7", wobei "M" die Etage ist und "7" die laufende Raumnummer
// innerhalb dieser Etage. Aktuell gibt es die Etagen M, 1, 2 und 4, das
// kann sich aber ändern, deshalb steht die Liste an genau einer Stelle.

export const FLOORS = ["M", "1", "2", "4"];

const ROOMS_PER_FLOOR = 35;

export function roomIdsForFloor(floor) {
  const ids = [];
  for (let i = 1; i <= ROOMS_PER_FLOOR; i++) {
    ids.push(`E16.${floor}.${i}`);
  }
  return ids;
}

export const ALL_ROOM_IDS = FLOORS.flatMap(roomIdsForFloor);

// Liest die Etage aus einer Raum-ID heraus. Das wird zum Beispiel beim
// Excel-Import gebraucht, um zu prüfen, ob eine importierte Zeile zu einer
// bekannten Etage gehört oder zu einer, die gerade nicht in der Auswahl ist.
export function floorOfRoomId(roomId) {
  const match = /^E16\.([^.]+)\./.exec(roomId);
  return match ? match[1] : FLOORS[0];
}

export function roomLabel(roomId, nicknames) {
  const nick = nicknames[roomId];
  return nick ? `${roomId} – ${nick}` : roomId;
}
