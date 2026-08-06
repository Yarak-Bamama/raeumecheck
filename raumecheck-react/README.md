# Räumecheck (React)

Same room-inspection app as `../Räumecheck.html`, rebuilt as a React project with cleanly separated files instead of one large HTML file. Meant for active development with live reload.

## Requirements

Node.js (LTS) must be installed.

## Development

```
npm install
npm run dev
```

Opens a local server (default: `http://localhost:5173`) that reloads the browser on every saved change.

## Build

```
npm run build
```

Produces a static production build in the `dist/` folder, deployable on any web server.

## Project structure

- `src/lib/` – plain helper functions with no React dependency: floor/room numbers, field definitions, TSV/Excel import and export, image compression for floor plans.
- `src/state/` – the central app state (reducer, context, derived values) and its persistence to localStorage.
- `src/components/` – reusable building blocks such as the app bar, floor picker, dialog scaffolding, icons.
- `src/screens/` – the four main views: start, wizard, room overview, global overview.
- `src/modals/` – the individual dialogs (edit, confirm delete, import preview, etc.).
- `src/styles/` – the stylesheet, split by topic instead of a single CSS file.

## Differences from the HTML version

A few small, deliberate simplifications compared to `Räumecheck.html`:

- The wizard's progress dots can no longer be clicked to jump back to an arbitrary, already-completed desk. That behavior was error-prone in the old version when jumping back more than one desk. Corrections to already-completed desks now go through the edit dialog in the room overview; the "Back" button in the wizard still jumps to the immediately preceding desk.
