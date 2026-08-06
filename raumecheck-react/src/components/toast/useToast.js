import { useContext } from "react";
import { ToastContext } from "./ToastContext";

// Gibt eine kleine API zurück, mit der jede Komponente eine Meldung
// einblenden kann, ohne selbst wissen zu müssen, wie die Toast-Liste
// intern verwaltet wird.
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast muss innerhalb von ToastProvider verwendet werden.");
  }
  return { show: context.show };
}
