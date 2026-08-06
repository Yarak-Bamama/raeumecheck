import { FLOORS } from "../lib/floors";
import { useAppState } from "../state/useAppState";

// The large, easily tappable floor selector used on the start screen and
// in the global overview. onFloorChange is optional and is needed, for
// example, on the start screen to clear the room selection as soon as the
// floor changes — otherwise a previously selected room would suddenly
// belong to the wrong floor.
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
