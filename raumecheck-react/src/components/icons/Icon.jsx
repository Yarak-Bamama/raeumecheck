import { ICONS } from "./iconPaths";

// Renders one of the predefined line icons. The shape comes from
// iconPaths.js; everything else (size, stroke width, color) is applied
// consistently here, so new icons only need to supply their path data and
// automatically fit into the overall look.
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
