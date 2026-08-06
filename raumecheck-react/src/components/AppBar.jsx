import { floorOfRoomId, roomLabel } from "../lib/floors";
import { useAppState } from "../state/useAppState";
import { Icon } from "./icons/Icon";

// Determines which floor is currently "implied". In the wizard and the room
// overview, this follows from the room currently open; on the other
// screens, it's simply the last selected floor.
function effectiveFloor(view, state) {
  if (view.screen === "wizard" && state.session) return floorOfRoomId(state.session.roomId);
  if (view.screen === "roomOverview") return floorOfRoomId(view.roomId);
  return state.currentFloor;
}

export function AppBar({ view, goTo, onOpenMap }) {
  const { state } = useAppState();
  const floor = effectiveFloor(view, state);

  let subLabel = "";
  if (view.screen === "wizard" && state.session) subLabel = roomLabel(state.session.roomId, state.nicknames);
  else if (view.screen === "roomOverview") subLabel = roomLabel(view.roomId, state.nicknames);
  else if (view.screen === "global") subLabel = "Gesamtübersicht";
  else subLabel = `Etage ${floor}`;

  return (
    <div className="app-bar">
      {view.screen !== "setup" && (
        <button
          className="btn btn-secondary btn-icon"
          title="Start"
          onClick={() => goTo("setup")}
        >
          <Icon name="home" />
        </button>
      )}

      <div className="app-bar__brand">
        <span className="floor-tab is-static">{floor}</span>
        <span className="app-bar__sub">{subLabel}</span>
      </div>

      <div className="app-bar__actions">
        <button className="btn btn-secondary btn-icon" title="Etagenplan" onClick={() => onOpenMap(floor)}>
          <Icon name="map" />
        </button>
        {view.screen !== "global" && (
          <button
            className="btn btn-secondary btn-icon"
            title="Gesamtübersicht"
            onClick={() => goTo("global")}
          >
            <Icon name="grid" />
          </button>
        )}
      </div>
    </div>
  );
}
