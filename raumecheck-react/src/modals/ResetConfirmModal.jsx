import { useState } from "react";
import { Modal } from "../components/Modal";
import { Icon } from "../components/icons/Icon";

// Damit ein versehentlicher Klick nicht sofort alle Daten löscht, muss man
// hier erst das Wort LÖSCHEN eintippen, bevor der eigentliche Löschen-Knopf
// überhaupt aktiv wird.
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
