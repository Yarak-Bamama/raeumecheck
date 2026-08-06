import { useState } from "react";
import { roomLabel } from "../lib/floors";
import { tableToRowValues, rowsToTSV } from "../lib/tsv";
import { copyToClipboard } from "../lib/clipboard";
import { useAppState } from "../state/useAppState";
import { EntryCard } from "../components/EntryCard";
import { Icon } from "../components/icons/Icon";
import { EditTableModal } from "../modals/EditTableModal";
import { ConfirmDeleteModal } from "../modals/ConfirmDeleteModal";
import { FinishRoomModal } from "../modals/FinishRoomModal";

function formatTimestamp(ts) {
  try {
    const date = new Date(ts);
    return `${date.toLocaleDateString("de-AT")} ${date.toLocaleTimeString("de-AT", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } catch {
    return "";
  }
}

export function RoomOverviewScreen({ roomId, goTo }) {
  const { state, dispatch } = useAppState();
  const tables = state.rooms[roomId]?.tables ?? [];
  const copiedAt = state.copiedAt[roomId];

  const [editingTable, setEditingTable] = useState(null);
  const [deletingTable, setDeletingTable] = useState(null);
  const [finishResult, setFinishResult] = useState(null);

  function addAnotherTable() {
    dispatch({ type: "START_SESSION", roomId, plannedCount: 1 });
    goTo("wizard");
  }

  function saveEdit(draft) {
    dispatch({ type: "UPDATE_TABLE", roomId, tableId: draft.id, patch: draft });
    setEditingTable(null);
  }

  function confirmDeletion() {
    dispatch({ type: "DELETE_TABLE", roomId, tableId: deletingTable.id });
    setDeletingTable(null);
  }

  async function finishRoom() {
    const rows = tables.map((table) => tableToRowValues(roomId, table));
    const text = rowsToTSV(rows);
    const ok = await copyToClipboard(text);
    dispatch({ type: "SET_COPIED_AT", roomId, timestamp: Date.now() });
    setFinishResult({ ok, text });
  }

  return (
    <>
      <h1 className="page-title">{roomLabel(roomId, state.nicknames)}</h1>
      <p className="page-sub">
        {tables.length} Tisch{tables.length === 1 ? "" : "e"} erfasst
        {copiedAt ? ` · zuletzt kopiert ${formatTimestamp(copiedAt)}` : ""}
      </p>

      <div>
        {tables.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Icon name="box" />
            </div>
            <p>Für diesen Raum wurden noch keine Tische erfasst.</p>
          </div>
        ) : (
          tables.map((table) => (
            <EntryCard
              key={table.id}
              table={table}
              onEdit={() => setEditingTable(table)}
              onDelete={() => setDeletingTable(table)}
            />
          ))
        )}
      </div>

      <div className="action-grid" style={{ marginTop: 6 }}>
        <button className="btn btn-secondary" onClick={addAnotherTable}>
          <Icon name="plus" /> Tisch hinzufügen
        </button>
        <button className="btn btn-primary" disabled={tables.length === 0} onClick={finishRoom}>
          <Icon name="copy" /> Raum abschließen
        </button>
      </div>

      {editingTable && (
        <EditTableModal table={editingTable} onSave={saveEdit} onClose={() => setEditingTable(null)} />
      )}
      {deletingTable && (
        <ConfirmDeleteModal
          table={deletingTable}
          onConfirm={confirmDeletion}
          onClose={() => setDeletingTable(null)}
        />
      )}
      {finishResult && (
        <FinishRoomModal
          ok={finishResult.ok}
          text={finishResult.text}
          tableCount={tables.length}
          roomLabelText={roomLabel(roomId, state.nicknames)}
          onClose={() => setFinishResult(null)}
        />
      )}
    </>
  );
}
