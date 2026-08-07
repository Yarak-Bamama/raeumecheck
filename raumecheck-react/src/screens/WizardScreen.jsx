import { useEffect, useRef, useState } from "react";
import { FIELD_KEYS, FIELD_META } from "../lib/fields";
import { describeDuplicates, findDuplicates } from "../lib/duplicates";
import { roomLabel } from "../lib/floors";
import { useAppState } from "../state/useAppState";
import { WizardField } from "../components/WizardField";
import { Icon } from "../components/icons/Icon";
import { CancelWizardModal } from "../modals/CancelWizardModal";

// Führt Tisch für Tisch durch die acht Felder. Der Kern der Bedienlogik ist,
// dass Enter in einem Feld zum nächsten springt, ganz ohne Maus. Welches
// Feld gerade "aktiv" ist, steht in der Session im globalen State, damit ein
// Reload mitten im Ausfüllen nichts verliert. Welches DOM-Element für ein
// Feld tatsächlich den Fokus bekommen muss, ist dagegen reine Bedienlogik
// und wird hier lokal über Refs verwaltet.
export function WizardScreen({ goTo }) {
  const { state, dispatch } = useAppState();
  const session = state.session;
  const fieldRefs = useRef({});
  const [showCancelModal, setShowCancelModal] = useState(false);

  function registerRef(key, element) {
    fieldRefs.current[key] = element;
  }

  function focusField(key) {
    const element = fieldRefs.current[key];
    if (!element) return;
    if (element.classList.contains("toggle-group")) {
      const target = element.querySelector(".is-selected") ?? element.querySelector(".toggle-btn");
      target?.focus();
    } else {
      element.focus();
      element.select?.();
    }
  }

  useEffect(() => {
    if (session) focusField(session.activeField);
    // Nur beim Wechsel des aktiven Felds neu fokussieren, nicht bei jeder Änderung des Entwurfstexts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.activeField, session?.completedCount]);

  if (!session) return null;

  function handleChangeValue(field, value) {
    dispatch({ type: "UPDATE_DRAFT_FIELD", field, value });
  }

  function handleFocusField(field) {
    if (field !== session.activeField) dispatch({ type: "SET_ACTIVE_FIELD", field });
  }

  function handleAdvance(fromField) {
    const index = FIELD_KEYS.indexOf(fromField);
    if (index < FIELD_KEYS.length - 1) {
      dispatch({ type: "SET_ACTIVE_FIELD", field: FIELD_KEYS[index + 1] });
    } else {
      const wasLastTable = session.completedCount + 1 >= session.plannedCount;
      dispatch({ type: "FINALIZE_TABLE" });
      if (wasLastTable) goTo("roomOverview", { roomId: session.roomId });
    }
  }

  function handleRetreat() {
    const index = FIELD_KEYS.indexOf(session.activeField);
    if (index > 0) {
      dispatch({ type: "SET_ACTIVE_FIELD", field: FIELD_KEYS[index - 1] });
    } else if (session.completedCount > 0) {
      dispatch({ type: "RETREAT_TO_PREVIOUS_TABLE" });
    }
  }

  function handleCancelRequest() {
    const hasDraftContent = Object.entries(session.draft).some(
      ([key, value]) => key !== "geprueft" && value,
    );
    if (hasDraftContent) setShowCancelModal(true);
    else finishCancel();
  }

  function finishCancel() {
    const hadCompletedTables = session.completedCount > 0;
    const roomId = session.roomId;
    dispatch({ type: "CANCEL_SESSION" });
    goTo(hadCompletedTables ? "roomOverview" : "setup", hadCompletedTables ? { roomId } : undefined);
  }

  const isBackDisabled = session.activeField === FIELD_KEYS[0] && session.completedCount === 0;

  return (
    <>
      <div className="wizard-head">
        <span className="wizard-room-chip">{roomLabel(session.roomId, state.nicknames)}</span>
        <span className="wizard-count">
          Tisch {session.completedCount + 1} von {session.plannedCount}
        </span>
      </div>

      <div className="progress-track">
        {Array.from({ length: session.plannedCount }, (_, i) => {
          const status = i < session.completedCount ? "is-done" : i === session.completedCount ? "is-current" : "";
          return (
            <span key={i} className={`progress-dot ${status}`}>
              {i < session.completedCount ? <Icon name="check" /> : i + 1}
            </span>
          );
        })}
      </div>

      <form onSubmit={(event) => event.preventDefault()}>
        {FIELD_META.map((field) => (
          <WizardField
            key={field.key}
            field={field}
            value={session.draft[field.key]}
            isActive={field.key === session.activeField}
            warning={
              field.checkDuplicates
                ? describeDuplicates(
                    findDuplicates(state.rooms, field.key, session.draft[field.key], {
                      roomId: session.roomId,
                    }),
                  )
                : null
            }
            registerRef={registerRef}
            onChangeValue={handleChangeValue}
            onFocusField={handleFocusField}
            onAdvance={handleAdvance}
          />
        ))}
      </form>

      <div className="wizard-footer">
        <button type="button" className="btn btn-secondary" disabled={isBackDisabled} onClick={handleRetreat}>
          <Icon name="arrowLeft" /> Zurück
        </button>
        <button type="button" className="btn btn-primary" style={{ flex: "none" }} onClick={handleCancelRequest}>
          Abbrechen
        </button>
        <button type="button" className="btn btn-primary" onClick={() => handleAdvance(session.activeField)}>
          Weiter
        </button>
      </div>

      {showCancelModal && (
        <CancelWizardModal onStay={() => setShowCancelModal(false)} onLeave={finishCancel} />
      )}
    </>
  );
}
