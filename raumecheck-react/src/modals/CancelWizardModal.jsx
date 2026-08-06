import { Modal } from "../components/Modal";

// Erscheint nur, wenn im aktuell offenen Tisch schon irgendwo Text steht,
// der beim Abbrechen verloren ginge. Bereits abgeschlossene Tische derselben
// Session sind davon nicht betroffen, die bleiben so oder so erhalten.
export function CancelWizardModal({ onStay, onLeave }) {
  return (
    <Modal onClose={onStay}>
      <h3 className="modal__title">Rundgang abbrechen?</h3>
      <p className="modal__body">
        Die Eingaben für den aktuellen Tisch sind noch nicht gespeichert und gehen verloren.
        Bereits abgeschlossene Tische bleiben erhalten.
      </p>
      <div className="modal__actions">
        <button className="btn btn-secondary" onClick={onStay}>
          Weiter ausfüllen
        </button>
        <button className="btn btn-danger-solid" onClick={onLeave}>
          Verwerfen &amp; verlassen
        </button>
      </div>
    </Modal>
  );
}
