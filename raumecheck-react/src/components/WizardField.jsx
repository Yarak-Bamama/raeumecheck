import { Icon } from "./icons/Icon";

// Renders one of the eight desk fields, whether in the wizard or the edit
// dialog. registerRef keeps track of the focusable element per field, so
// the calling component can jump to the next or previous field via
// keyboard, as required by the "Enter advances" behavior.
export function WizardField({ field, value, isActive, registerRef, onChangeValue, onFocusField, onAdvance }) {
  const label = (
    <div className="field-label">
      <span className="field-label__text">{field.label}</span>
      {field.hint && <span className="field-label__hint">{field.hint}</span>}
    </div>
  );

  function handleEnterAdvances(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      onAdvance(field.key);
    }
  }

  let body;
  if (field.type === "text") {
    body = (
      <input
        ref={(el) => registerRef(field.key, el)}
        className="input"
        type="text"
        value={value}
        placeholder={field.placeholder ?? ""}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        enterKeyHint="next"
        onChange={(event) => onChangeValue(field.key, event.target.value)}
        onKeyDown={handleEnterAdvances}
        onFocus={() => onFocusField(field.key)}
      />
    );
  } else if (field.type === "textarea") {
    body = (
      <textarea
        ref={(el) => registerRef(field.key, el)}
        className="textarea"
        value={value}
        placeholder={field.placeholder ?? ""}
        enterKeyHint="done"
        onChange={(event) => onChangeValue(field.key, event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) handleEnterAdvances(event);
        }}
        onFocus={() => onFocusField(field.key)}
      />
    );
  } else {
    body = (
      <div
        ref={(el) => registerRef(field.key, el)}
        className="toggle-group"
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          const buttons = [...event.currentTarget.querySelectorAll(".toggle-btn")];
          const currentIndex = buttons.indexOf(document.activeElement);
          const nextIndex =
            event.key === "ArrowRight"
              ? Math.min(buttons.length - 1, currentIndex + 1)
              : Math.max(0, currentIndex - 1);
          buttons[nextIndex].focus();
        }}
      >
        <button
          type="button"
          className={`toggle-btn is-no${!value ? " is-selected" : ""}`}
          onFocus={() => onFocusField(field.key)}
          onClick={() => {
            onChangeValue(field.key, false);
            onAdvance(field.key);
          }}
        >
          <Icon name="x" /> Nein
        </button>
        <button
          type="button"
          className={`toggle-btn is-yes${value ? " is-selected" : ""}`}
          onFocus={() => onFocusField(field.key)}
          onClick={() => {
            onChangeValue(field.key, true);
            onAdvance(field.key);
          }}
        >
          <Icon name="check" /> Ja
        </button>
      </div>
    );
  }

  return (
    <div className={`field${isActive ? " is-active" : ""}`} data-fieldwrap={field.key}>
      {label}
      {body}
    </div>
  );
}
