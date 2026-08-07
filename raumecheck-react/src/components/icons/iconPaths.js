// Rohdaten für alle Strich-Icons der App. Jeder Eintrag beschreibt nur die
// Form innerhalb des SVGs (Pfade, Rechtecke, Kreise), nicht das umschließende
// svg-Element selbst, denn das übernimmt einheitlich die Icon-Komponente.
// So bleiben Größe, Strichstärke und Farbgebung an einer einzigen Stelle
// steuerbar, egal welches Icon gerade dargestellt wird.

export const ICONS = {
  home: {
    markup:
      '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9.5a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>',
  },
  grid: {
    markup:
      '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  },
  edit: {
    size: 15,
    markup: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  },
  trash: {
    size: 15,
    markup:
      '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  },
  plus: {
    strokeWidth: 2.3,
    markup: '<path d="M12 5v14M5 12h14"/>',
  },
  copy: {
    markup:
      '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  },
  download: {
    markup: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  },
  check: {
    size: 15,
    strokeWidth: 2.5,
    markup: '<path d="M20 6 9 17l-5-5"/>',
  },
  arrowLeft: {
    strokeWidth: 2.3,
    markup: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  },
  arrowRight: {
    strokeWidth: 2.3,
    markup: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  },
  lock: {
    markup: '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  },
  alert: {
    markup:
      '<path d="m10.3 3.9-8 14A1.5 1.5 0 0 0 3.6 20h16.8a1.5 1.5 0 0 0 1.3-2.1l-8-14a1.5 1.5 0 0 0-2.6 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  },
  box: {
    size: 30,
    strokeWidth: 1.6,
    markup:
      '<path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  },
  x: {
    size: 15,
    strokeWidth: 2.5,
    markup: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  },
  map: {
    markup:
      '<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20Z"/><path d="M9 4v13.5"/><path d="M15 6.5V20"/>',
  },
  upload: {
    markup: '<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 21h14"/>',
  },
  search: {
    markup: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  },
  link: {
    markup: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><path d="M8 12h8"/>',
  },
};
