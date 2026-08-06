// Reine Funktionen für alles, was die erfassten Tische selbst verändert:
// hinzufügen, bearbeiten, löschen und der Massen-Import aus Excel. Jede
// Funktion bekommt das bisherige "rooms"-Objekt und liefert ein neues
// zurück, ohne das alte zu verändern, wie es React für einen Reducer
// erwartet.

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

// Entfernt einen bereits abgeschlossenen Tisch wieder aus der Liste, damit
// der Wizard ihn zur Korrektur erneut als Entwurf anzeigen kann. Gibt sowohl
// die neuen Räume als auch den entfernten Tisch zurück, denn genau der wird
// gebraucht, um das Entwurfsformular damit vorzubefüllen.
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
