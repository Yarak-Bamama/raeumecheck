// Everything related to floors and room numbers. A room is named e.g.
// "E16.M.7", where "M" is the floor and "7" is the sequential room number
// within that floor. The current floors are M, 1, 2, and 4, but that list
// may change, so it's kept in exactly one place.

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

// Extracts the floor from a room ID. Used e.g. during Excel import to check
// whether an imported row belongs to a known floor or to one that isn't
// currently selectable.
export function floorOfRoomId(roomId) {
  const match = /^E16\.([^.]+)\./.exec(roomId);
  return match ? match[1] : FLOORS[0];
}

export function roomLabel(roomId, nicknames) {
  const nick = nicknames[roomId];
  return nick ? `${roomId} – ${nick}` : roomId;
}
