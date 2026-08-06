import { FLOORS } from "../lib/floors";
import { Modal } from "../components/Modal";
import { Icon } from "../components/icons/Icon";

// Shows a summary before the actual import, so the user can confirm the
// file was read correctly before anything in the existing data changes.
export function ImportPreviewModal({ result, fileName, onConfirm, onClose }) {
  const roomCount = new Set(result.entries.map((entry) => entry.roomId)).size;

  return (
    <Modal onClose={onClose}>
      <h3 className="modal__title">
        <Icon name="upload" /> Import aus „{fileName}“
      </h3>
      <p className="modal__body">
        <strong>{result.entries.length}</strong> Tisch-Zeile(n) aus <strong>{roomCount}</strong>{" "}
        Raum/Räumen gefunden. Diese werden als neue Einträge zu den bestehenden Daten hinzugefügt
        (bestehende Einträge bleiben unverändert).
      </p>
      {result.skipped > 0 && (
        <p className="modal__body" style={{ marginTop: -8 }}>
          {result.skipped} Zeile(n) ohne Raumnummer wurden übersprungen.
        </p>
      )}
      {result.unknownFloors.length > 0 && (
        <p className="modal__body" style={{ marginTop: -8 }}>
          Hinweis: Etage(n) "{result.unknownFloors.join(", ")}" sind nicht in der Etagen-Auswahl (
          {FLOORS.join(", ")}) – Daten werden trotzdem gespeichert, erscheinen aber nicht im
          Etagen-Raster.
        </p>
      )}
      <div className="modal__actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Abbrechen
        </button>
        <button className="btn btn-primary" onClick={onConfirm}>
          <Icon name="check" /> Importieren
        </button>
      </div>
    </Modal>
  );
}
