import { useRef, useState } from "react";
import { FIELD_KEYS, FIELD_META } from "../lib/fields";
import { Modal } from "../components/Modal";
import { WizardField } from "../components/WizardField";
import { Icon } from "../components/icons/Icon";

// Zeigt dieselben acht Felder wie der Wizard, aber für einen bereits
// bestehenden Tisch, den man nachträglich korrigieren will. Der Entwurf lebt
// hier rein lokal in der Komponente, erst ein Klick auf Speichern schreibt
// die Änderungen in den globalen State.
export function EditTableModal({ table, onSave, onClose }) {
  const [draft, setDraft] = useState(table);
  const fieldRefs = useRef({});

  function registerRef(key, element) {
    fieldRefs.current[key] = element;
  }

  function focusField(key) {
    const element = fieldRefs.current[key];
    if (!element) return;
    if (element.classList.contains("toggle-group")) {
      const target = element.querySelector(".is-selected") ?? element.querySelector(".toggle-btn");
      target?.focus();
    } else {
      element.focus();
      element.select?.();
    }
  }

  function handleChangeValue(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleAdvance(fromField) {
    const index = FIELD_KEYS.indexOf(fromField);
    if (index < FIELD_KEYS.length - 1) focusField(FIELD_KEYS[index + 1]);
    else onSave(draft);
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="modal__title">Tisch bearbeiten</h3>
      <form onSubmit={(event) => event.preventDefault()}>
        {FIELD_META.map((field) => (
          <WizardField
            key={field.key}
            field={field}
            value={draft[field.key]}
            isActive={false}
            registerRef={registerRef}
            onChangeValue={handleChangeValue}
            onFocusField={() => {}}
            onAdvance={handleAdvance}
          />
        ))}
      </form>
      <div className="modal__actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Abbrechen
        </button>
        <button className="btn btn-primary" onClick={() => onSave(draft)}>
          <Icon name="check" /> Speichern
        </button>
      </div>
    </Modal>
  );
}
