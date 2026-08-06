import { useContext } from "react";
import { AppStateContext } from "./AppStateContext";

// The only way components access the global state and the action dispatch.
// Deliberately throws if someone forgets to mount the AppStateProvider,
// rather than silently continuing with undefined.
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState muss innerhalb von AppStateProvider verwendet werden.");
  }
  return context;
}
