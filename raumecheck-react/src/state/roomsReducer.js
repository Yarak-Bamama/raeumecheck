// Pure functions for everything that modifies the captured desks
// themselves: adding, editing, deleting, and bulk import from Excel. Each
// function takes the previous "rooms" object and returns a new one without
// mutating the old one, as React expects from a reducer.

function getTables(rooms, roomId) {
  return rooms[roomId]?.tables ?? [];
}

export function addTable(rooms, roomId, table) {
  const tables = getTables(rooms, roomId);
  return {
    ...rooms,
    [roomId]: { tables: [...tables, table] },
  };
}

export function updateTable(rooms, roomId, tableId, patch) {
  const tables = getTables(rooms, roomId).map((table) =>
    table.id === tableId ? { ...table, ...patch } : table,
  );
  return { ...rooms, [roomId]: { tables } };
}

export function deleteTable(rooms, roomId, tableId) {
  const tables = getTables(rooms, roomId).filter((table) => table.id !== tableId);
  return { ...rooms, [roomId]: { tables } };
}

// Removes an already-completed desk from the list so the wizard can show
// it again as a draft for correction. Returns both the updated rooms and
// the removed desk, since the latter is needed to pre-fill the draft form.
export function popLastTable(rooms, roomId) {
  const tables = getTables(rooms, roomId);
  const removedTable = tables[tables.length - 1];
  if (!removedTable) return { rooms, removedTable: null };
  return {
    rooms: { ...rooms, [roomId]: { tables: tables.slice(0, -1) } },
    removedTable,
  };
}

export function importEntries(rooms, entries) {
  let nextRooms = rooms;
  for (const entry of entries) {
    const { roomId, ...tableFields } = entry;
    nextRooms = addTable(nextRooms, roomId, { id: crypto.randomUUID(), ...tableFields });
  }
  return nextRooms;
}
