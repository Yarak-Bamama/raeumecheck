import { Icon } from "./icons/Icon";

export function RoomTile({ roomId, nickname, tableCount, isCopied, onClick }) {
  const shortId = roomId.split(".").pop();

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
