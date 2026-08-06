import { useEffect } from "react";

// Das Grundgerüst für alle Dialoge in der App: ein abgedunkelter Hinter-
// grund, darauf ein von unten hereinrutschendes Blatt (auf dem Handy) oder
// zentriertes Fenster (am Desktop). Was tatsächlich im Dialog steht, geben
// die aufrufenden Komponenten als Kinder mit, Modal kümmert sich nur um
// Rahmen, Schließen per Escape-Taste und Schließen per Klick daneben.
export function Modal({ onClose, children }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onMouseDown={handleBackdropClick}>
      <div className="modal" role="dialog">
        <div className="modal__handle" />
        {children}
      </div>
    </div>
  );
}
