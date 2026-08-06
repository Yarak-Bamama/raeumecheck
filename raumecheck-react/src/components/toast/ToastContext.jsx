import { createContext, useCallback, useState } from "react";

export const ToastContext = createContext(null);

const VISIBLE_DURATION_MS = 2600;
const LEAVE_ANIMATION_MS = 220;

// Manages the list of currently visible toast messages. Each toast starts
// out in the "visible" state and switches to "leaving" shortly before
// removal, giving the fade-out animation in ToastHost time to play before
// the entry is actually removed from the list.
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
