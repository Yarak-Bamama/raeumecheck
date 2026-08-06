import { useRef, useState } from "react";
import { Icon } from "./icons/Icon";

// Eine Zeile in der Raumliste des Start-Screens. Der Zusatzname lässt sich
// direkt in der Zeile bearbeiten, ohne dass sich dafür ein eigener Dialog
// öffnet, das Stiftsymbol schaltet einfach zwischen Anzeige und einem
// Eingabefeld um.
export function RoomRow({ roomId, nickname, tableCount, isSelected, onSelect, onNicknameChange }) {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const inputRef = useRef(null);

  function startEditing(event) {
    event.stopPropagation();
    setIsEditingNickname(true);
    // Der Browser muss das Eingabefeld erst rendern, bevor man es fokussieren kann.
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
