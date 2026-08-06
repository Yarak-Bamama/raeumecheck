import { useEffect, useState } from "react";
import { useAppState } from "./state/useAppState";
import { AppBar } from "./components/AppBar";
import { FloorMapViewer } from "./components/FloorMapViewer";
import { ToastHost } from "./components/toast/ToastHost";
import { SetupScreen } from "./screens/SetupScreen";
import { WizardScreen } from "./screens/WizardScreen";
import { RoomOverviewScreen } from "./screens/RoomOverviewScreen";
import { GlobalScreen } from "./screens/GlobalScreen";

// Which screen is currently shown deliberately isn't stored in global
// state but kept locally here, since it's pure navigation and doesn't need
// to land in localStorage. If an inspection round is in progress, though
// (state.session is set), the user should always land on the wizard, even
// after a reload, so that data entered mid-round isn't lost through
// accidental navigation.
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
