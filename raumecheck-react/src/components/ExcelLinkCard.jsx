import { DEFAULT_SHEET_NAME } from "../lib/xlsxExport";
import { useExcelLink } from "../state/useExcelLink";
import { SelectSheetModal } from "../modals/SelectSheetModal";
import { Icon } from "./icons/Icon";

// Zeigt in der Gesamtübersicht, ob eine Excel-Datei verknüpft ist, in die
// automatisch bei jeder Änderung geschrieben wird. Ersetzt das manuelle
// Kopieren oder wiederholte Exportieren, sobald einmal eine Datei und ein
// Tabellenblatt gewählt wurden.
export function ExcelLinkCard() {
  const {
    isSupported,
    isReady,
    isLinked,
    fileName,
    sheetName,
    needsPermission,
    pendingChoice,
    link,
    unlink,
    changeSheet,
    confirmSheetChoice,
    cancelSheetChoice,
    confirmPermission,
  } = useExcelLink();

  const sheetModal = pendingChoice && (
    <SelectSheetModal
      sheetNames={pendingChoice.sheetNames}
      currentSheet={pendingChoice.currentSheet}
      defaultNewName={DEFAULT_SHEET_NAME}
      onConfirm={confirmSheetChoice}
      onClose={cancelSheetChoice}
    />
  );

  if (!isSupported) {
    return (
      <div className="card card-pad excel-link-card" style={{ marginBottom: 20 }}>
        <p className="page-sub" style={{ margin: 0 }}>
          Automatisches Speichern in eine Excel-Datei braucht Edge oder Chrome. Bitte weiterhin über
          „Als Excel (.xlsx)“ exportieren.
        </p>
      </div>
    );
  }

  if (!isReady) return null;

  if (!isLinked) {
    return (
      <div className="card card-pad excel-link-card" style={{ marginBottom: 20 }}>
        <div className="excel-link-card__row">
          <Icon name="link" />
          <div>
            <p className="excel-link-card__title">Automatisch in Excel speichern</p>
            <p className="excel-link-card__text">
              Einmal eine Datei auswählen, danach schreibt die App bei jeder Änderung automatisch alle
              Daten dorthin. Hat die Datei schon mehrere Blätter, fragt sie vorher, welches sie
              verwenden soll.
            </p>
          </div>
        </div>
        <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 12 }} onClick={link}>
          <Icon name="link" /> Excel-Datei verknüpfen
        </button>
        {sheetModal}
      </div>
    );
  }

  if (needsPermission) {
    return (
      <div className="card card-pad excel-link-card excel-link-card--warn" style={{ marginBottom: 20 }}>
        <div className="excel-link-card__row">
          <Icon name="alert" />
          <div>
            <p className="excel-link-card__title">Verknüpfung bestätigen</p>
            <p className="excel-link-card__text">
              „{fileName}“ ist verknüpft, der Browser braucht nach dem Neustart aber einmal deine
              Bestätigung, bevor er wieder automatisch schreiben darf.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-block"
          style={{ marginTop: 12 }}
          onClick={confirmPermission}
        >
          <Icon name="check" /> Bestätigen
        </button>
      </div>
    );
  }

  return (
    <div className="card card-pad excel-link-card excel-link-card--ok" style={{ marginBottom: 20 }}>
      <div className="excel-link-card__row">
        <Icon name="check" />
        <div>
          <p className="excel-link-card__title">Verknüpft mit „{fileName}“</p>
          <p className="excel-link-card__text">
            Blatt „{sheetName}“ wird bei jeder Änderung automatisch aktualisiert.
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button type="button" className="btn btn-ghost" onClick={changeSheet}>
          Blatt wechseln
        </button>
        <button type="button" className="btn btn-ghost" onClick={unlink}>
          Verknüpfung aufheben
        </button>
      </div>
      {sheetModal}
    </div>
  );
}
