import { ALL_ROOM_IDS } from "../lib/floors";

export function roomTables(rooms, roomId) {
  return rooms[roomId]?.tables ?? [];
}

// The app knows a fixed list of room IDs for the current floors, but an
// Excel import can also contain room numbers outside that list, e.g. from
// a floor that isn't currently selectable. So that such data still shows
// up in the overall statistics and in the export, the fixed list is merged
// here with the rooms actually present in state.
export function knownAndExtraRoomIds(rooms) {
  const ids = new Set(ALL_ROOM_IDS);
  for (const roomId of Object.keys(rooms)) ids.add(roomId);
  return [...ids];
}

export function allTableEntries(rooms) {
  return knownAndExtraRoomIds(rooms).flatMap((roomId) =>
    roomTables(rooms, roomId).map((table) => ({ roomId, table })),
  );
}
