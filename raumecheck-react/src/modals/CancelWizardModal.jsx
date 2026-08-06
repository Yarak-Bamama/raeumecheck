import { Modal } from "../components/Modal";

// Only appears if the currently open desk already has some text entered
// that would be lost on cancel. Already-completed desks in the same
// session are unaffected — those are kept either way.
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
