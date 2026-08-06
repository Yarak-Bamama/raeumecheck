import { useContext } from "react";
import { Icon } from "../icons/Icon";
import { ToastContext } from "./ToastContext";

const ICON_BY_TYPE = {
  warn: "alert",
  danger: "trash",
  download: "download",
  ok: "check",
};

// Zeigt die aktuell aktiven Toasts unten auf dem Bildschirm an. Die
// Provider-Komponente entscheidet, wann ein Toast erscheint und wieder
// verschwindet, diese Komponente kümmert sich nur um die Darstellung.
export function ToastHost() {
  const { toasts } = useContext(ToastContext);

  return (
    <div id="toast-host">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast${toast.type === "warn" ? " is-warn" : ""}${
            toast.type === "danger" ? " is-danger" : ""
          }${toast.leaving ? " leaving" : ""}`}
        >
          <span className="toast__icon">
            <Icon name={ICON_BY_TYPE[toast.type] ?? "check"} />
          </span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
