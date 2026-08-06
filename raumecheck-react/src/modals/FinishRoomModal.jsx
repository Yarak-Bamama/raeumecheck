import { Modal } from "../components/Modal";
import { Icon } from "../components/icons/Icon";
import { useToast } from "../components/toast/useToast";
import { copyToClipboard } from "../lib/clipboard";

// Shows the result of the copy attempt when finishing a room. If automatic
// copying fails — for instance because the page was opened without https —
// the text stays visible so it can be selected and copied by hand.
export function FinishRoomModal({ ok, text, tableCount, roomLabelText, onClose }) {
  const toast = useToast();

  async function retryCopy() {
    const success = await copyToClipboard(text);
    toast.show(success ? "Erneut kopiert." : "Kopieren fehlgeschlagen – bitte manuell markieren.", success ? "ok" : "warn");
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="modal__title">
        {ok ? (
          <>
            <Icon name="check" /> In Zwischenablage kopiert
          </>
        ) : (
          "Kopieren nicht möglich"
        )}
      </h3>
      <p className="modal__body">
        {ok
          ? `Die ${tableCount} Zeile(n) für ${roomLabelText} wurden kopiert. Mit Strg+V (oder Cmd+V) direkt in deine Excel-Tabelle einfügen.`
          : "Automatisches Kopieren hat nicht funktioniert. Bitte den Text unten manuell markieren und kopieren."}
      </p>
      <div className="copy-fallback">{text}</div>
      <div className="modal__actions" style={{ marginTop: 14 }}>
        <button className="btn btn-secondary" onClick={retryCopy}>
          <Icon name="copy" /> Erneut kopieren
        </button>
        <button className="btn btn-primary" onClick={onClose}>
          Fertig
        </button>
      </div>
    </Modal>
  );
}
