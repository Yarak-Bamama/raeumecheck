import { useState } from "react";
import { Modal } from "../components/Modal";
import { Icon } from "../components/icons/Icon";

// So an accidental click doesn't immediately wipe all data, the user must
// first type the confirmation word here before the actual delete button
// becomes active at all.
export function ResetConfirmModal({ onConfirm, onClose }) {
  const [confirmText, setConfirmText] = useState("");
  const canConfirm = confirmText.trim().toUpperCase() === "LÖSCHEN";

  return (
    <Modal onClose={onClose}>
      <h3 className="modal__title">
        <Icon name="lock" /> Alle Daten zurücksetzen?
      </h3>
      <p className="modal__body">
        Das löscht <strong>alle</strong> erfassten Tische in <strong>allen</strong> Räumen
        unwiderruflich aus diesem Browser. Excel-Export vorher empfohlen. Zum Bestätigen unten
        „LÖSCHEN“ eingeben.
      </p>
      <input
        className="input"
        placeholder="LÖSCHEN"
        autoComplete="off"
        style={{ marginBottom: 14 }}
        value={confirmText}
        onChange={(event) => setConfirmText(event.target.value)}
        autoFocus
      />
      <div className="modal__actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Abbrechen
        </button>
        <button className="btn btn-danger-solid" disabled={!canConfirm} onClick={onConfirm}>
          <Icon name="trash" /> Endgültig löschen
        </button>
      </div>
    </Modal>
  );
}
