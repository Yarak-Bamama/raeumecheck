import { Icon } from "./icons/Icon";
import { specialRoomName } from "../lib/specialRooms";

export function RoomTile({ roomId, nickname, tableCount, isCopied, onClick }) {
  const shortId = roomId.split(".").pop();
  const specialName = specialRoomName(roomId);

  if (specialName) {
    return (
      <div className="room-tile room-tile--special">
        <span className="room-tile__id">{shortId}</span>
        <span className="room-tile__nick">{specialName}</span>
        <span className="room-tile__count">kein Check nötig</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`room-tile${tableCount > 0 ? " has-data" : ""}`}
      onClick={onClick}
    >
      <span className="room-tile__id">{shortId}</span>
      {nickname && <span className="room-tile__nick">{nickname}</span>}
      <span className="room-tile__count">
        {tableCount > 0 ? `${tableCount} Tisch${tableCount === 1 ? "" : "e"}` : "leer"}
      </span>
      {isCopied && (
        <span className="room-tile__copied">
          <Icon name="check" /> kopiert
        </span>
      )}
    </button>
  );
}
