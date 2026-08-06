import { useState } from "react";
import { roomIdsForFloor } from "../lib/floors";
import { useAppState } from "../state/useAppState";
import { useToast } from "../components/toast/useToast";
import { RubiconLogo } from "../components/RubiconLogo";
import { FloorPicker } from "../components/FloorPicker";
import { RoomRow } from "../components/RoomRow";
import { Icon } from "../components/icons/Icon";

const MIN_COUNT = 1;
const MAX_COUNT = 80;

export function SetupScreen({ goTo }) {
  const { state, dispatch } = useAppState();
  const toast = useToast();

  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [count, setCount] = useState(5);

  const roomsOnFloor = roomIdsForFloor(state.currentFloor).filter((roomId) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const nickname = state.nicknames[roomId] ?? "";
    return roomId.toLowerCase().includes(term) || nickname.toLowerCase().includes(term);
  });

  function handleFloorChange() {
    setSelectedRoomId(null);
    setSearchTerm("");
  }

  function clampCount(value) {
    return Math.max(MIN_COUNT, Math.min(MAX_COUNT, value || MIN_COUNT));
  }

  function startWalkthrough() {
    if (!selectedRoomId) {
      toast.show("Bitte zuerst einen Raum auswählen.", "warn");
      return;
    }
    dispatch({ type: "START_SESSION", roomId: selectedRoomId, plannedCount: count });
    goTo("wizard");
  }

  return (
    <>
      <div className="brand-header">
        <RubiconLogo />
      </div>
      <h1 className="page-title">Neuer Rundgang</h1>
      <p className="page-sub">Etage auswählen, dann Raum und Anzahl der zu prüfenden Tische.</p>

      <div className="section-label">Etage</div>
      <FloorPicker onFloorChange={handleFloorChange} />

      <div className="section-label">Raum</div>
      <div className="search-wrap">
        <span className="search-icon">
          <Icon name="search" />
        </span>
        <input
          className="input"
          placeholder="Raum suchen … z. B. 7 oder Küche"
          autoComplete="off"
          spellCheck="false"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="room-list">
        {roomsOnFloor.length === 0 ? (
          <p style={{ padding: 16, color: "var(--text-muted)", fontSize: 13 }}>Kein Raum gefunden.</p>
        ) : (
          roomsOnFloor.map((roomId) => (
            <RoomRow
              key={roomId}
              roomId={roomId}
              nickname={state.nicknames[roomId] ?? ""}
              tableCount={state.rooms[roomId]?.tables.length ?? 0}
              isSelected={selectedRoomId === roomId}
              onSelect={() => setSelectedRoomId(roomId)}
              onNicknameChange={(nickname) => dispatch({ type: "SET_NICKNAME", roomId, nickname })}
            />
          ))
        )}
      </div>

      <div style={{ height: 18 }} />
      <div className="section-label">Anzahl Tische</div>
      <div className="field-num" style={{ marginBottom: 22 }}>
        <button
          type="button"
          className="stepper-btn"
          onClick={() => setCount((current) => clampCount(current - 1))}
        >
          –
        </button>
        <input
          className="input"
          type="number"
          min={MIN_COUNT}
          max={MAX_COUNT}
          inputMode="numeric"
          value={count}
          onChange={(event) => setCount(clampCount(parseInt(event.target.value, 10)))}
        />
        <button
          type="button"
          className="stepper-btn"
          onClick={() => setCount((current) => clampCount(current + 1))}
        >
          +
        </button>
      </div>

      <button type="button" className="btn btn-primary btn-lg btn-block" onClick={startWalkthrough}>
        Rundgang starten <Icon name="arrowRight" />
      </button>
    </>
  );
}
