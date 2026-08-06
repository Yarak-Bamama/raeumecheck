import { defaultState } from "../lib/storage";
import { addTable, deleteTable, importEntries, updateTable } from "./roomsReducer";
import { finalizeTable, retreatToPreviousTable, startSession } from "./sessionReducer";

// The app's central reducer. It only knows how individual actions change
// the state, not where those actions originate. The actual field order in
// the wizard deliberately isn't handled here but in the wizard component
// itself — see sessionReducer.js.
export function appReducer(state, action) {
  switch (action.type) {
    case "SET_CURRENT_FLOOR":
      return { ...state, currentFloor: action.floor };

    case "SET_NICKNAME": {
      const nicknames = { ...state.nicknames };
      if (action.nickname) nicknames[action.roomId] = action.nickname;
      else delete nicknames[action.roomId];
      return { ...state, nicknames };
    }

    case "START_SESSION":
      return { ...state, session: startSession(action.roomId, action.plannedCount) };

    case "UPDATE_DRAFT_FIELD":
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          draft: { ...state.session.draft, [action.field]: action.value },
        },
      };

    case "SET_ACTIVE_FIELD":
      if (!state.session) return state;
      return { ...state, session: { ...state.session, activeField: action.field } };

    case "FINALIZE_TABLE": {
      if (!state.session) return state;
      const result = finalizeTable(state.rooms, state.session);
      return { ...state, rooms: result.rooms, session: result.session };
    }

    case "RETREAT_TO_PREVIOUS_TABLE": {
      if (!state.session) return state;
      const result = retreatToPreviousTable(state.rooms, state.session);
      return { ...state, rooms: result.rooms, session: result.session };
    }

    case "CANCEL_SESSION":
      return { ...state, session: null };

    case "ADD_TABLE":
      return { ...state, rooms: addTable(state.rooms, action.roomId, action.table) };

    case "UPDATE_TABLE":
      return {
        ...state,
        rooms: updateTable(state.rooms, action.roomId, action.tableId, action.patch),
      };

    case "DELETE_TABLE":
      return { ...state, rooms: deleteTable(state.rooms, action.roomId, action.tableId) };

    case "SET_COPIED_AT":
      return { ...state, copiedAt: { ...state.copiedAt, [action.roomId]: action.timestamp } };

    case "IMPORT_ENTRIES":
      return { ...state, rooms: importEntries(state.rooms, action.entries) };

    case "RESET_ALL":
      return defaultState();

    default:
      return state;
  }
}
