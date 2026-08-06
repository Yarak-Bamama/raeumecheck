import { Icon } from "./icons/Icon";

export function EntryCard({ table, onEdit, onDelete }) {
  return (
    <div className="entry-card">
      <div className="entry-card__top">
        <div className="entry-card__title">
          <strong>{table.tischNr || "(ohne Tisch-Nr)"}</strong>
          <span className={`status-pill ${table.geprueft ? "yes" : "no"}`}>
            {table.geprueft ? "Geprüft" : "Offen"}
          </span>
        </div>
        <div className="entry-card__actions">
          <button className="btn btn-secondary btn-icon" title="Bearbeiten" onClick={onEdit}>
            <Icon name="edit" />
          </button>
          <button className="btn btn-danger btn-icon" title="Löschen" onClick={onDelete}>
            <Icon name="trash" />
          </button>
        </div>
      </div>

      <div className="entry-grid">
        <div>
          <span className="k">Laptop</span>
          <span className="v">{table.laptopNr || "–"}</span>
        </div>
        <div>
          <span className="k">Docking</span>
          <span className="v">{table.dockingNr || "–"}</span>
        </div>
        <div>
          <span className="k">Monitor 1</span>
          <span className="v">{table.monitor1 || "–"}</span>
        </div>
        <div>
          <span className="k">Monitor 2</span>
          <span className="v">{table.monitor2 || "–"}</span>
        </div>
        <div>
          <span className="k">Monitor 3</span>
          <span className="v">{table.monitor3 || "–"}</span>
        </div>
      </div>

      {table.anmerkungen && <div className="entry-note">{table.anmerkungen}</div>}
    </div>
  );
}
