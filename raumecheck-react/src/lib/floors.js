// Alles rund um Etagen und Raumnummern. Ein Raum heißt zum Beispiel
// "E16.M.7", wobei "M" die Etage ist und "7" die laufende Raumnummer
// innerhalb dieser Etage. Aktuell gibt es die Etagen M, 1, 2 und 4, das
// kann sich aber ändern, deshalb steht die Liste an genau einer Stelle.

export const FLOORS = ["M", "1", "2", "4"];

// Die Raumnummerierung fängt nicht auf jeder Etage wieder bei 1 an, Etage 1
// zum Beispiel geht von 34 bis 51 weiter. Deshalb hier pro Etage der genaue
// Nummernbereich, mit 1 bis 35 als Standard für Etagen, die noch nicht
// einzeln eingetragen wurden.
const DEFAULT_ROOM_RANGE = { start: 1, end: 35 };

const ROOM_RANGE_BY_FLOOR = {
  1: { start: 34, end: 51 },
  2: { start: 37, end: 58 },
  4: { start: 13, end: 20 }
};

export function roomIdsForFloor(floor) {
  const { start, end } = ROOM_RANGE_BY_FLOOR[floor] ?? DEFAULT_ROOM_RANGE;
  const ids = [];
  for (let i = start; i <= end; i++) {
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
