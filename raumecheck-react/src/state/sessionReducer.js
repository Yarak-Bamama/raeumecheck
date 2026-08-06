// Der "Session"-Teil des States beschreibt einen laufenden Rundgang durch
// einen Raum: welcher Raum, wie viele Tische geplant sind, wie viele schon
// fertig sind, und der Entwurf des gerade offenen Tisches. Diese Datei regelt
// nur den Übergang von einem Tisch zum nächsten, die Frage "welches Feld
// kommt als nächstes dran" gehört bewusst der Wizard-Komponente, weil das
// reine Bedienlogik ist und keine Datenhaltung.

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

// Schließt den aktuellen Entwurf als fertigen Tisch ab und hängt ihn an die
// Raumliste an. Ist danach die geplante Anzahl erreicht, endet die Session
// und man landet in der Raumübersicht, sonst geht es mit einem leeren
// Entwurf für den nächsten Tisch weiter.
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

// Nimmt den zuletzt abgeschlossenen Tisch wieder aus der Liste und legt ihn
// als Entwurf zurück, damit man ihn korrigieren kann. Wird nur für den
// unmittelbar vorherigen Tisch benutzt (Zurück-Button ganz am Anfang eines
// neuen Tisches), nicht für beliebig weit zurückliegende Tische, denn dafür
// gibt es den Bearbeiten-Dialog in der Raumübersicht.
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
