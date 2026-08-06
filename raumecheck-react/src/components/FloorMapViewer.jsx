import { useEffect, useRef, useState } from "react";
import { compressImageFile } from "../lib/imageCompress";
import { getFloorMap, setFloorMap } from "../lib/storage";
import { useToast } from "./toast/useToast";
import { Icon } from "./icons/Icon";

// Vollbild-Ansicht des Etagenplans. Ist noch kein Plan für die Etage
// hinterlegt, zeigt sie stattdessen eine Aufforderung, ein Foto hochzuladen.
// Das Foto wird vor dem Speichern verkleinert, weil localStorage insgesamt
// nur wenige Megabyte pro Seite erlaubt und ein Handyfoto das leicht
// sprengen würde. Ein Klick auf das Bild vergrößert es, damit man auch auf
// dem Handy Details lesen kann, ohne dass die Seite selbst zoombar sein muss.
export function FloorMapViewer({ floor, onClose }) {
  const [imageUrl, setImageUrl] = useState(() => getFloorMap(floor));
  const [isZoomed, setIsZoomed] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    setImageUrl(getFloorMap(floor));
    setIsZoomed(false);
  }, [floor]);

  async function handleFileChosen(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    toast.show("Plan wird verarbeitet …", "ok");
    let dataUrl;
    try {
      dataUrl = await compressImageFile(file, 1800, 0.75);
    } catch {
      toast.show("Bild konnte nicht gelesen werden.", "warn");
      return;
    }

    const ok = setFloorMap(floor, dataUrl);
    if (!ok) {
      toast.show("Plan zu groß zum Speichern.", "warn");
      return;
    }
    setImageUrl(dataUrl);
    toast.show("Etagenplan gespeichert.", "ok");
  }

  return (
    <div className="map-overlay">
      <div className="map-toolbar">
        <span className="app-bar__floor-label">ETAGE {floor}</span>
        <div style={{ display: "flex", gap: 8 }}>
          {imageUrl && (
            <button
              className="btn btn-secondary btn-icon"
              title="Ersetzen"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="edit" />
            </button>
          )}
          <button className="btn btn-secondary btn-icon" title="Schließen" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
      </div>

      {imageUrl ? (
        <div className="map-view">
          <img
            src={imageUrl}
            alt={`Etagenplan Etage ${floor}`}
            className={isZoomed ? "is-zoomed" : ""}
            onClick={() => setIsZoomed((zoomed) => !zoomed)}
          />
        </div>
      ) : (
        <div className="map-empty">
          <div className="map-empty__icon">
            <Icon name="map" />
          </div>
          <p>Noch kein Etagenplan für Etage {floor} hinterlegt.</p>
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
            <Icon name="plus" /> Plan hinzufügen
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChosen}
      />
    </div>
  );
}
