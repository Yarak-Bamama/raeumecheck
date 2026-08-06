import { Modal } from "../components/Modal";

// Only shown when the automatic copy triggered by "Copy all" fails, so the
// text can at least be selected and copied by hand.
export function CopyFallbackModal({ text, onClose }) {
  return (
    <Modal onClose={onClose}>
      <h3 className="modal__title">Kopieren nicht möglich</h3>
      <p className="modal__body">Bitte den Text unten manuell markieren und kopieren.</p>
      <div className="copy-fallback">{text}</div>
      <div className="modal__actions" style={{ marginTop: 14 }}>
        <button className="btn btn-primary" onClick={onClose}>
          Fertig
        </button>
      </div>
    </Modal>
  );
}
