import { createContext, useEffect, useReducer, useRef } from "react";
import { loadState, persistState } from "../lib/storage";
import { appReducer } from "./reducer";
import { useToast } from "../components/toast/useToast";

export const AppStateContext = createContext(null);

// Hält den gesamten fachlichen Zustand der App (Räume, Tische, Session,
// gewählte Etage) und schreibt ihn bei jeder Änderung mit einer kleinen
// Verzögerung nach localStorage. Die Verzögerung verhindert, dass bei
// jedem einzelnen Tastendruck im Wizard sofort geschrieben wird, ohne dass
// dabei nennenswert Daten verloren gehen könnten, falls die Seite doch
// einmal mitten im Tippen neu geladen wird.
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
