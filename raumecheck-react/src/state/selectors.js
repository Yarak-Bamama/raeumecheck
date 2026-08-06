import { ALL_ROOM_IDS } from "../lib/floors";

export function roomTables(rooms, roomId) {
  return rooms[roomId]?.tables ?? [];
}

// Die App kennt eine feste Liste an Raum-IDs für die aktuellen Etagen, aber
// ein Excel-Import kann auch Raumnummern enthalten, die außerhalb dieser
// Liste liegen, etwa von einer Etage, die gerade nicht zur Auswahl steht.
// Damit solche Daten trotzdem in der Gesamtstatistik und im Export
// auftauchen, wird hier die feste Liste mit den tatsächlich im State
// vorhandenen Räumen vereinigt.
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
