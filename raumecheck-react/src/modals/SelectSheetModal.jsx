import { useState } from "react";
import { Modal } from "../components/Modal";
import { Icon } from "../components/icons/Icon";

// Lässt auswählen, in welches Tabellenblatt einer (meist schon bestehenden)
// Excel-Datei die Ausstattungsdaten automatisch geschrieben werden sollen.
// Wird sowohl beim ersten Verknüpfen gezeigt, wenn die gewählte Datei schon
// mehrere Blätter enthält, als auch später über "Blatt wechseln".
export function SelectSheetModal({ sheetNames, currentSheet, defaultNewName, onConfirm, onClose }) {
  const [selected, setSelected] = useState(currentSheet && sheetNames.includes(currentSheet) ? currentSheet : null);
  const [newName, setNewName] = useState(defaultNewName);

  const canConfirm = selected ? true : newName.trim().length > 0;

  function confirm() {
    const name = selected ?? newName.trim();
    if (!name) return;
    onConfirm(name);
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="modal__title">Tabellenblatt wählen</h3>
      <p className="modal__body">
        Diese Datei enthält bereits Blätter. In welches soll die App die Ausstattungsdaten automatisch
        schreiben?
      </p>

      <div className="sheet-option-list">
        {sheetNames.map((name) => (
          <label key={name} className="sheet-option">
            <input
              type="radio"
              name="sheet"
              checked={selected === name}
              onChange={() => setSelected(name)}
            />
            {name}
          </label>
        ))}
        <label className="sheet-option">
          <input type="radio" name="sheet" checked={selected === null} onChange={() => setSelected(null)} />
          Neues Blatt anlegen
        </label>
        {selected === null && (
          <input
            className="input"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Name des neuen Blatts"
            style={{ marginTop: 6 }}
            autoFocus
          />
        )}
      </div>

      <div className="modal__actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Abbrechen
        </button>
        <button className="btn btn-primary" disabled={!canConfirm} onClick={confirm}>
          <Icon name="check" /> Übernehmen
        </button>
      </div>
    </Modal>
  );
}
