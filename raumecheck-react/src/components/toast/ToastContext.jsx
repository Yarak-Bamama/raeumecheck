import { createContext, useCallback, useState } from "react";

export const ToastContext = createContext(null);

const VISIBLE_DURATION_MS = 2600;
const LEAVE_ANIMATION_MS = 220;

// Verwaltet die Liste der gerade sichtbaren Toast-Meldungen. Jeder Toast
// bekommt zuerst den Zustand "sichtbar" und wechselt kurz vor dem Entfernen
// in den Zustand "leaving", damit die Ausblend-Animation in ToastHost Zeit
// hat zu spielen, bevor der Eintrag wirklich aus der Liste verschwindet.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "ok") => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, type, leaving: false }]);

    setTimeout(() => {
      setToasts((current) => current.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    }, VISIBLE_DURATION_MS);

    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, VISIBLE_DURATION_MS + LEAVE_ANIMATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, show }}>{children}</ToastContext.Provider>
  );
}
