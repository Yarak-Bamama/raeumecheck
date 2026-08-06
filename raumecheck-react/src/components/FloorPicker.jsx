import { FLOORS } from "../lib/floors";
import { useAppState } from "../state/useAppState";

// Die große, gut antippbare Etagen-Auswahl auf dem Start-Screen und in der
// Gesamtübersicht. onFloorChange ist optional und wird zum Beispiel im
// Start-Screen gebraucht, um die Raumauswahl zurückzusetzen, sobald man die
// Etage wechselt, denn ein vorher gewählter Raum gehört sonst plötzlich zur
// falschen Etage.
export function FloorPicker({ onFloorChange }) {
  const { state, dispatch } = useAppState();

  function selectFloor(floor) {
    if (floor === state.currentFloor) return;
    dispatch({ type: "SET_CURRENT_FLOOR", floor });
    onFloorChange?.();
  }

  return (
    <div className="floor-picker">
      {FLOORS.map((floor) => (
        <button
          key={floor}
          type="button"
          className={`floor-picker-btn${floor === state.currentFloor ? " is-active" : ""}`}
          onClick={() => selectFloor(floor)}
        >
          <span className="floor-picker-btn__label">Etage</span>
          {floor}
        </button>
      ))}
    </div>
  );
}
