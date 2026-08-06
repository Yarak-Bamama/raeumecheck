import { useEffect, useState } from "react";
import { useAppState } from "./state/useAppState";
import { AppBar } from "./components/AppBar";
import { FloorMapViewer } from "./components/FloorMapViewer";
import { ToastHost } from "./components/toast/ToastHost";
import { SetupScreen } from "./screens/SetupScreen";
import { WizardScreen } from "./screens/WizardScreen";
import { RoomOverviewScreen } from "./screens/RoomOverviewScreen";
import { GlobalScreen } from "./screens/GlobalScreen";

// Welcher Screen gerade zu sehen ist, steht bewusst nicht im globalen State,
// sondern lokal hier, denn es ist reine Navigation und muss nicht in
// localStorage landen. Läuft dagegen gerade ein Rundgang (state.session ist
// gesetzt), soll man immer auf dem Wizard landen, auch nach einem Reload,
// damit unterwegs eingegebene Daten nicht durch versehentliches Wegnavigieren
// verloren gehen.
export default function App() {
  const { state } = useAppState();
  const [view, setView] = useState({ screen: "setup" });
  const [mapViewerFloor, setMapViewerFloor] = useState(null);

  useEffect(() => {
    if (state.session && view.screen !== "wizard") setView({ screen: "wizard" });
  }, [state.session, view.screen]);

  function goTo(screen, params) {
    setView({ screen, ...params });
    window.scrollTo(0, 0);
  }

  return (
    <div id="app">
      <AppBar view={view} goTo={goTo} onOpenMap={setMapViewerFloor} />

      <main className="screen">
        {view.screen === "setup" && <SetupScreen goTo={goTo} />}
        {view.screen === "wizard" && <WizardScreen goTo={goTo} />}
        {view.screen === "roomOverview" && <RoomOverviewScreen roomId={view.roomId} goTo={goTo} />}
        {view.screen === "global" && <GlobalScreen goTo={goTo} />}
      </main>

      <div className="app-footer">
        Läuft komplett offline · Daten bleiben nur lokal in diesem Browser gespeichert
      </div>

      {mapViewerFloor && (
        <FloorMapViewer floor={mapViewerFloor} onClose={() => setMapViewerFloor(null)} />
      )}
      <ToastHost />
    </div>
  );
}
