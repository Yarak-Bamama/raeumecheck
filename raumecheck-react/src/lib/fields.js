// Beschreibt die acht Felder, die pro Tisch im Wizard abgefragt werden, und
// zwar genau in der Reihenfolge, in der sie ausgefüllt werden. Wizard und
// Bearbeiten-Dialog greifen beide auf diese eine Liste zurück, damit sich
// Reihenfolge und Beschriftungen nie auseinanderentwickeln können.

export const FIELD_META = [
  {
    key: "tischNr",
    label: "Tisch-Nr",
    type: "text",
    placeholder: "z. B. ST0001, T0071, „kein Pickerl“",
    checkDuplicates: true,
  },
  {
    key: "laptopNr",
    label: "Laptop-Nr / PC-Nummer",
    type: "text",
    placeholder: "Inventarnummer oder „nicht da“",
    checkDuplicates: true,
  },
  {
    key: "monitor1",
    label: "Monitor 1-Nr",
    type: "text",
    placeholder: "Inventarnummer",
    checkDuplicates: true,
  },
  {
    key: "monitor2",
    label: "Monitor 2-Nr",
    type: "text",
    placeholder: "Inventarnummer (optional)",
    checkDuplicates: true,
  },
  {
    key: "monitor3",
    label: "Monitor 3-Nr",
    type: "text",
    placeholder: "Inventarnummer (optional)",
    checkDuplicates: true,
  },
  {
    key: "dockingNr",
    label: "Dockingstation-Nr",
    type: "text",
    placeholder: "Standrechner“ oder „hat keine",
    checkDuplicates: true,
  },
  { key: "geprueft", label: "Geprüft?", type: "bool" },
  {
    key: "anmerkungen",
    label: "Anmerkungen",
    type: "textarea",
    placeholder: "Optional, mehrzeilig …",
  },
];

export const FIELD_KEYS = FIELD_META.map((field) => field.key);

export function emptyDraft() {
  return {
    tischNr: "",
    laptopNr: "",
    monitor1: "",
    monitor2: "",
    monitor3: "",
    dockingNr: "",
    geprueft: false,
    anmerkungen: "",
  };
}
