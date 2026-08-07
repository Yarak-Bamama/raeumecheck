// Manche Räume sind keine normalen Büros, sondern zum Beispiel eine Küche,
// eine Toilette oder ein Technikraum. Dort gibt es keine Tische zu prüfen,
// deshalb tauchen sie im Rundgang gar nicht erst als auswählbar auf. Die
// Liste ist nach Etage sortiert und wird erweitert, sobald weitere Etagen
// durchgegangen werden.
const SPECIAL_ROOMS_BY_FLOOR = {
  M: {
    6: "Küche",
    8: "Toilette",
    9: "Toilette",
    13: "Netzwerkraum",
    14: "Abstellkammer",
    15: "Edison",
    16: "Toilette",
    17: "Elion",
    18: "Küche",
    20: "Toilette",
    21: "Küche",
    22: "Toilette",
    27: "Toilette",
    28: "Küche",
    29: "Toilette",
  },
  4: {
    18: "Teeküche",
    19: "Netzwerkraum",
  },
};

export function specialRoomName(roomId) {
  const [, floor, number] = roomId.split(".");
  return SPECIAL_ROOMS_BY_FLOOR[floor]?.[number];
}

export function isSpecialRoom(roomId) {
  return specialRoomName(roomId) !== undefined;
}
