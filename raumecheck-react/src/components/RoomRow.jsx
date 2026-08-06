import { useRef, useState } from "react";
import { Icon } from "./icons/Icon";

// A row in the room list on the start screen. The nickname can be edited
// directly inline without opening a separate dialog — the pencil icon
// simply toggles between display mode and an input field.
export function RoomRow({ roomId, nickname, tableCount, isSelected, onSelect, onNicknameChange }) {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const inputRef = useRef(null);

  function startEditing(event) {
    event.stopPropagation();
    setIsEditingNickname(true);
    // The browser has to render the input field before it can be focused.
    requestAnimationFrame(() => inputRef.current?.select());
  }

  function commitNickname() {
    onNicknameChange(inputRef.current.value.trim());
    setIsEditingNickname(false);
  }

  return (
    <button
      type="button"
      className={`room-row${isSelected ? " is-selected" : ""}`}
      onClick={onSelect}
    >
      <span className="room-row__id">{roomId}</span>

      {isEditingNickname ? (
        <input
          ref={inputRef}
          className="nick-input"
          defaultValue={nickname}
          placeholder="Zusatzname (optional)"
          onClick={(event) => event.stopPropagation()}
          onBlur={commitNickname}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitNickname();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              setIsEditingNickname(false);
            }
          }}
        />
      ) : (
        <span className="room-row__nick">
          {nickname || <span style={{ color: "var(--text-faint)" }}>kein Zusatzname</span>}
        </span>
      )}

      {tableCount > 0 && <span className="room-row__count">{tableCount} erfasst</span>}

      <span className="room-row__edit" title="Zusatzname bearbeiten" onClick={startEditing}>
        <Icon name="edit" />
      </span>
    </button>
  );
}
