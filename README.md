# Räumecheck

Eine kleine Web-App, die die Ausstattungskontrolle der Räume einfacher macht – als Ersatz für das bisherige Erfassen per Hand in Excel.

## Worum geht's?

Bei der Inventur wird pro Raum jeder Tisch mit seiner Ausstattung geprüft (Tisch-Nr, Laptop, Monitore, Dockingstation) und festgehalten, ob alles passt oder ob es eine Anmerkung gibt (z. B. "Pickerl fehlt" oder "Laptop nicht da"). Bisher wurde das direkt in eine Excel-Tabelle eingetragen. Räumecheck macht genau das – nur bequemer:

- Raum auswählen, Tisch für Tisch durchklicken, Nummern eintragen
- Direkt sehen, was schon geprüft ist und was noch offen ist (pro Raum und insgesamt)
- Auffälligkeiten als Anmerkung festhalten, statt sie in einer Excel-Zelle zu suchen

## Für Excel-Umsteiger

Man muss nicht bei null anfangen und nichts wird "weggenommen":

- **Bestehende Excel-Listen importieren:** Eine vorhandene .xlsx-, .xls- oder .csv-Datei einlesen – die Zeilen werden automatisch als Tische übernommen.
- **Ergebnis als Excel exportieren:** Der aktuelle Stand lässt sich jederzeit als .xlsx-Datei herunterladen, z. B. um es weiterzuleiten oder wie gewohnt weiterzuverarbeiten.
- **Alles kopieren:** Für alle, die die Daten schnell in eine andere Tabelle einfügen wollen.

Alle Daten bleiben lokal im Browser gespeichert – es muss also nichts hochgeladen oder eingerichtet werden.

## Zwei Varianten im Repo

**`Räumecheck.html`** ist die ursprüngliche, eigenständige Version: eine einzelne Datei, kein Build-Tool, kein Server nötig. Einfach im Browser öffnen (oder die Desktop-Verknüpfung nutzen) und sie läuft komplett offline. Für den schnellen Einsatz unterwegs ist das nach wie vor die einfachste Variante.

**`raumecheck-react/`** ist dieselbe App, neu aufgebaut mit React, in einzelne Komponenten und Module aufgeteilt statt einer einzigen großen Datei. Für die Entwicklung braucht es Node.js, dafür gibt es einen Live-Server, der Änderungen sofort im Browser zeigt. Siehe `raumecheck-react/README.md` für die Bedienung.

Wichtig: Die beiden Varianten teilen sich **keine** gespeicherten Daten, weil Browser lokale Daten pro Adresse (Datei vs. `localhost`) getrennt speichern. Ein Umstieg von der einen zur anderen Version funktioniert über den Excel-Export der einen und den Excel-Import der anderen.

## Starten (Räumecheck.html)

Einfach die Datei `Räumecheck.html` im Browser öffnen. Kein Installieren, kein Setup, keine Internetverbindung nötig.
