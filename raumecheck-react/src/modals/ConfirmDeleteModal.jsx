import { Modal } from "../components/Modal";
import { Icon } from "../components/icons/Icon";

export function ConfirmDeleteModal({ table, onConfirm, onClose }) {
  return (
    <Modal onClose={onClose}>
      <h3 className="modal__title">Tisch löschen?</h3>
      <p className="modal__body">
        „{table.tischNr || "(ohne Tisch-Nr)"}“ wird endgültig aus diesem Raum entfernt.
      </p>
      <div className="modal__actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Abbrechen
        </button>
        <button className="btn btn-danger-solid" onClick={onConfirm}>
          <Icon name="trash" /> Löschen
        </button>
      </div>
    </Modal>
  );
}
