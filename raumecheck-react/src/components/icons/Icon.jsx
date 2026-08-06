import { ICONS } from "./iconPaths";

// Rendert eines der vordefinierten Strich-Icons. Die Form kommt aus
// iconPaths.js, alles andere (Größe, Strichstärke, Farbe) wird hier einheit-
// lich gesetzt, damit neue Icons einfach nur ihre Pfaddaten mitbringen
// müssen und sich automatisch ins Gesamtbild einfügen.
export function Icon({ name, className }) {
  const icon = ICONS[name];
  if (!icon) return null;

  const size = icon.size ?? 18;
  const strokeWidth = icon.strokeWidth ?? 2;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: icon.markup }}
    />
  );
}
