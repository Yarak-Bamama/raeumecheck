import { useRef, useState } from "react";
import { FLOORS, roomIdsForFloor } from "../lib/floors";
import { allTableEntries, knownAndExtraRoomIds } from "../state/selectors";
import { useAppState } from "../state/useAppState";
import { useToast } from "../components/toast/useToast";
import { FloorPicker } from "../components/FloorPicker";
import { RoomTile } from "../components/RoomTile";
import { Icon } from "../components/icons/Icon";
import { tableToRowValues, rowsToTSV } from "../lib/tsv";
import { copyToClipboard } from "../lib/clipboard";
import { exportToXlsx } from "../lib/xlsxExport";
import { readWorkbookFile } from "../lib/xlsxImport";
import { CopyFallbackModal } from "../modals/CopyFallbackModal";
import { ImportPreviewModal } from "../modals/ImportPreviewModal";
import { ResetConfirmModal } from "../modals/ResetConfirmModal";

export function GlobalScreen({ goTo }) {
  const { state, dispatch } = useAppState();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [copyFallbackText, setCopyFallbackText] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const entries = allTableEntries(state.rooms);
  const total = entries.length;
  const yesCount = entries.filter((entry) => entry.table.geprueft).length;
  const noCount = total - yesCount;
  const percentDone = total ? Math.round((yesCount / total) * 100) : 0;

  const knownRoomIds = knownAndExtraRoomIds(state.rooms);
  const roomsWithData = knownRoomIds.filter((roomId) => (state.rooms[roomId]?.tables.length ?? 0) > 0).length;
  const floorRoomIds = roomIdsForFloor(state.currentFloor);

  function openRoom(roomId) {
    if ((state.rooms[roomId]?.tables.length ?? 0) > 0) {
      goTo("roomOverview", { roomId });
    } else {
      goTo("setup");
    }
  }

  async function copyAllData() {
    if (!entries.length) {
      toast.show("Es sind noch keine Daten erfasst.", "warn");
      return;
    }
    const rows = entries.map(({ roomId, table }) => tableToRowValues(roomId, table));
    const text = rowsToTSV(rows);
    const ok = await copyToClipboard(text);
    if (ok) toast.show(`${entries.length} Zeile(n) kopiert.`, "ok");
    else setCopyFallbackText(text);
  }

  function exportXlsx() {
    if (!entries.length) {
      toast.show("Es sind noch keine Daten erfasst.", "warn");
      return;
    }
    exportToXlsx(entries);
    toast.show("Excel-Datei wird heruntergeladen.", "download");
  }

  async function handleFileChosen(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const result = await readWorkbookFile(file);
      if (!result.entries.length) {
        toast.show("Keine verwertbaren Zeilen gefunden.", "warn");
        return;
      }
      setImportPreview({ result, fileName: file.name });
    } catch (error) {
      toast.show(error.message, "warn");
    }
  }

  function confirmImport() {
    dispatch({ type: "IMPORT_ENTRIES", entries: importPreview.result.entries });
    toast.show(`${importPreview.result.entries.length} Zeile(n) importiert.`, "ok");
    setImportPreview(null);
  }

  function resetAll() {
    dispatch({ type: "RESET_ALL" });
    toast.show("Alle Daten wurden gelöscht.", "danger");
    setShowResetModal(false);
  }

  return (
    <>
      <h1 className="page-title">Gesamtübersicht</h1>
      <p className="page-sub">
        {roomsWithData} von {knownRoomIds.length} Räumen (alle {FLOORS.length} Etagen) mit erfassten
        Daten.
      </p>

      <div className="stat-row">
        <div className="stat-tile">
          <div className="stat-tile__num">{total}</div>
          <div className="stat-tile__label">Tische</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile__num">
            {roomsWithData}/{knownRoomIds.length}
          </div>
          <div className="stat-tile__label">Räume</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile__num">{percentDone}%</div>
          <div className="stat-tile__label">Geprüft</div>
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div className="ratio-legend">
          <span>Geprüft: {yesCount}</span>
          <span>Offen: {noCount}</span>
        </div>
        <div className="ratio-bar">
          <div className="ratio-bar__yes" style={{ width: `${total ? (yesCount / total) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="section-label">Etage</div>
      <FloorPicker />

      <div className="section-label">Räume · Etage {state.currentFloor}</div>
      <div className="room-grid">
        {floorRoomIds.map((roomId) => (
          <RoomTile
            key={roomId}
            roomId={roomId}
            nickname={state.nicknames[roomId]}
            tableCount={state.rooms[roomId]?.tables.length ?? 0}
            isCopied={Boolean(state.copiedAt[roomId])}
            onClick={() => openRoom(roomId)}
          />
        ))}
      </div>

      <div className="section-label">Import</div>
      <div className="action-grid">
        <button className="btn btn-primary full" onClick={() => fileInputRef.current?.click()}>
          <Icon name="upload" /> Excel-Tabelle importieren
        </button>
      </div>
      <p className="page-sub" style={{ margin: "2px 2px 18px" }}>
        Liest eine .xlsx/.xls/.csv-Datei ein und trägt die Zeilen automatisch als neue Tische ein
        (Spalten wie beim Export, Reihenfolge oder Kopfzeile werden erkannt).
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: "none" }}
        onChange={handleFileChosen}
      />

      <div className="section-label">Export</div>
      <div className="action-grid">
        <button className="btn btn-secondary" onClick={copyAllData}>
          <Icon name="copy" /> Alles kopieren
        </button>
        <button className="btn btn-primary" onClick={exportXlsx}>
          <Icon name="download" /> Als Excel (.xlsx)
        </button>
        <button className="btn btn-danger full" onClick={() => setShowResetModal(true)}>
          <Icon name="trash" /> Alle Daten zurücksetzen
        </button>
      </div>

      {copyFallbackText && (
        <CopyFallbackModal text={copyFallbackText} onClose={() => setCopyFallbackText(null)} />
      )}
      {importPreview && (
        <ImportPreviewModal
          result={importPreview.result}
          fileName={importPreview.fileName}
          onConfirm={confirmImport}
          onClose={() => setImportPreview(null)}
        />
      )}
      {showResetModal && (
        <ResetConfirmModal onConfirm={resetAll} onClose={() => setShowResetModal(false)} />
      )}
    </>
  );
}
