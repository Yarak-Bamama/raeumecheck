// Describes the eight fields captured per desk in the wizard, in the exact
// order they're filled in. The wizard and the edit dialog both read from
// this single list so the field order and labels can never drift apart.

export const FIELD_META = [
  {
    key: "tischNr",
    label: "Tisch-Nr",
    type: "text",
    placeholder: "z. B. ST0001, T0071, „kein Pickerl“",
    hint: "Stehtisch (ST…) oder Tisch (T…)",
  },
  {
    key: "laptopNr",
    label: "Laptop-Nr",
    type: "text",
    placeholder: "Inventarnummer oder „nicht da“",
  },
  { key: "monitor1", label: "Monitor 1-Nr", type: "text", placeholder: "Inventarnummer" },
  {
    key: "monitor2",
    label: "Monitor 2-Nr",
    type: "text",
    placeholder: "Inventarnummer (optional)",
  },
  {
    key: "monitor3",
    label: "Monitor 3-Nr",
    type: "text",
    placeholder: "Inventarnummer (optional)",
  },
  {
    key: "dockingNr",
    label: "Dockingstation-Nr",
    type: "text",
    placeholder: "z. B. „Standrechner“ oder „hat keine“",
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
