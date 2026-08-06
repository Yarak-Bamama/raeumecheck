# Räumecheck (React)

Dieselbe Ausstattungskontroll-App wie `../Räumecheck.html`, hier aber als React-Projekt mit sauber getrennten Dateien statt einer einzigen großen HTML-Datei. Gedacht für die aktive Weiterentwicklung mit Live-Reload.

## Voraussetzungen

Node.js (LTS) muss installiert sein.

## Entwickeln

```
npm install
npm run dev
```

Öffnet einen lokalen Server (Standard: `http://localhost:5173`), der bei jeder gespeicherten Änderung sofort im Browser aktualisiert.

## Bauen

```
npm run build
```

Erzeugt eine fertige, statische Version im Ordner `dist/`, die sich auf einem beliebigen Webserver hosten lässt.

## Projektstruktur

- `src/lib/` – reine Hilfsfunktionen ohne React-Bezug: Etagen/Raumnummern, Feldbeschreibungen, TSV/Excel-Import und -Export, Bildkomprimierung für Etagenpläne.
- `src/state/` – der zentrale App-State (Reducer, Context, abgeleitete Werte) und dessen Speicherung in localStorage.
- `src/components/` – wiederverwendbare Bausteine wie App-Leiste, Etagen-Auswahl, Dialog-Grundgerüst, Icons.
- `src/screens/` – die vier Hauptansichten: Start, Wizard, Raumübersicht, Gesamtübersicht.
- `src/modals/` – die einzelnen Dialoge (Bearbeiten, Löschen bestätigen, Import-Vorschau und so weiter).
- `src/styles/` – das Stylesheet, aufgeteilt nach Themenbereich statt einer einzigen CSS-Datei.

## Unterschiede zur HTML-Version

Ein paar kleine, bewusste Vereinfachungen gegenüber `Räumecheck.html`:

- Die Fortschrittspunkte im Wizard lassen sich nicht mehr anklicken, um zu einem beliebigen, schon abgeschlossenen Tisch zurückzuspringen. Das war in der alten Version fehleranfällig, wenn man mehr als einen Tisch zurückgesprungen ist. Korrekturen an bereits abgeschlossenen Tischen laufen jetzt über den Bearbeiten-Dialog in der Raumübersicht, der "Zurück"-Knopf im Wizard springt weiterhin zum unmittelbar vorherigen Tisch.
