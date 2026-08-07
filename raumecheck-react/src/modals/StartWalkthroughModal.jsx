import { useState } from "react";
import { Modal } from "../components/Modal";
import { Icon } from "../components/icons/Icon";

const MIN_COUNT = 1;
const MAX_COUNT = 80;

function clampCount(value) {
  return Math.max(MIN_COUNT, Math.min(MAX_COUNT, value || MIN_COUNT));
}

// Fragt beim Anklicken eines leeren Raums in der Gesamtübersicht nur noch
// nach der Tischanzahl und startet den Rundgang direkt, ohne den Umweg über
// den Start-Screen mit erneuter Raumauswahl.
export function StartWalkthroughModal({ roomId, onStart, onClose }) {
  const [count, setCount] = useState(5);

  return (
    <Modal onClose={onClose}>
      <h3 className="modal__title">
        <Icon name="arrowRight" /> Rundgang für {roomId}
      </h3>
      <p className="modal__body">Wie viele Tische sollen in diesem Raum geprüft werden?</p>
      <div className="field-num" style={{ marginBottom: 18 }}>
        <button
          type="button"
          className="stepper-btn"
          onClick={() => setCount((current) => clampCount(current - 1))}
        >
          –
        </button>
        <input
          className="input"
          type="number"
          min={MIN_COUNT}
          max={MAX_COUNT}
          inputMode="numeric"
          value={count}
          onChange={(event) => setCount(clampCount(parseInt(event.target.value, 10)))}
          autoFocus
        />
        <button
          type="button"
          className="stepper-btn"
          onClick={() => setCount((current) => clampCount(current + 1))}
        >
          +
        </button>
      </div>
      <div className="modal__actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Abbrechen
        </button>
        <button className="btn btn-primary" onClick={() => onStart(count)}>
          Rundgang starten <Icon name="arrowRight" />
        </button>
      </div>
    </Modal>
  );
}
