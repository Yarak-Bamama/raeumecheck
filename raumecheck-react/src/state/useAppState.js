import { useContext } from "react";
import { AppStateContext } from "./AppStateContext";

// Der einzige Weg, wie Komponenten an den globalen State und den dispatch
// von Aktionen herankommen. Wirft absichtlich einen Fehler, wenn jemand
// vergisst, den AppStateProvider einzubinden, statt still mit undefined
// weiterzumachen.
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState muss innerhalb von AppStateProvider verwendet werden.");
  }
  return context;
}
