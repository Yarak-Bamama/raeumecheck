import { useEffect } from "react";

// The shared scaffolding for every dialog in the app: a dimmed backdrop
// with a sheet sliding up from the bottom (on mobile) or a centered window
// (on desktop). What's actually shown in the dialog is passed in as
// children by the calling component; Modal only handles the frame,
// closing on Escape, and closing on a backdrop click.
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
