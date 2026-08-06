// The "session" part of the state describes an inspection round in
// progress for a room: which room, how many desks are planned, how many
// are already done, and the draft of the desk currently open. This file
// only handles the transition from one desk to the next; the question of
// "which field comes next" deliberately belongs to the wizard component,
// since that's pure UI logic, not state management.

import { emptyDraft, FIELD_KEYS } from "../lib/fields";
import { addTable, popLastTable } from "./roomsReducer";

export function startSession(roomId, plannedCount) {
  return {
    roomId,
    plannedCount,
    completedCount: 0,
    draft: emptyDraft(),
    activeField: FIELD_KEYS[0],
  };
}

// Finalizes the current draft as a completed desk and appends it to the
// room list. If the planned count is reached afterward, the session ends
// and the user lands on the room overview; otherwise it continues with an
// empty draft for the next desk.
export function finalizeTable(rooms, session) {
  const table = { id: crypto.randomUUID(), ...session.draft };
  const nextRooms = addTable(rooms, session.roomId, table);
  const completedCount = session.completedCount + 1;

  if (completedCount >= session.plannedCount) {
    return { rooms: nextRooms, session: null, sessionEnded: true };
  }

  return {
    rooms: nextRooms,
    session: {
      ...session,
      completedCount,
      draft: emptyDraft(),
      activeField: FIELD_KEYS[0],
    },
    sessionEnded: false,
  };
}

// Takes the most recently completed desk back out of the list and restores
// it as a draft so it can be corrected. Only used for the immediately
// preceding desk (the Back button right at the start of a new desk), not
// for desks further back — that's what the edit dialog in the room
// overview is for.
export function retreatToPreviousTable(rooms, session) {
  const { rooms: nextRooms, removedTable } = popLastTable(rooms, session.roomId);
  if (!removedTable) return { rooms, session };

  const { id: _removedId, ...draft } = removedTable;
  return {
    rooms: nextRooms,
    session: {
      ...session,
      completedCount: session.completedCount - 1,
      draft,
      activeField: FIELD_KEYS[0],
    },
  };
}
