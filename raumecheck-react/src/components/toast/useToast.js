import { useContext } from "react";
import { ToastContext } from "./ToastContext";

// Returns a small API that lets any component show a message without
// needing to know how the toast list is managed internally.
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast muss innerhalb von ToastProvider verwendet werden.");
  }
  return { show: context.show };
}
