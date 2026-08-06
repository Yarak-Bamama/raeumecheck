import { createContext, useEffect, useReducer, useRef } from "react";
import { loadState, persistState } from "../lib/storage";
import { appReducer } from "./reducer";
import { useToast } from "../components/toast/useToast";

export const AppStateContext = createContext(null);

// Holds the app's entire domain state (rooms, desks, session, selected
// floor) and writes it to localStorage on every change, after a short
// debounce. The debounce prevents a write on every single keystroke in the
// wizard, without risking meaningful data loss if the page happens to
// reload mid-keystroke.
export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState);
  const toast = useToast();
  const saveTimer = useRef(null);

  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const ok = persistState(state);
      if (!ok) toast.show("Speichern fehlgeschlagen – Speicher voll?", "warn");
    }, 200);
    return () => clearTimeout(saveTimer.current);
  }, [state, toast]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>
  );
}
