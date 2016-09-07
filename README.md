#ChipschachDigital

Zweite Auflage von Chipschach mit verbessertem responsive Design, verbesserter Server Nutzung und einem ausgereiften Build System.

Entwickler: Simon Müller, Oliver Berg

###Architektur Entscheidungen:

- Server Framework: express
- Build Framework: grunt
- Frontend Framework: angular2 
- Datenbank: wahrscheinlich mongoDB
- Tests: unbestimmt

###Ordner Struktur:
- bin: Startup für app.js
- public: Frontend Dateien (nicht minifiziert, für Dev Umgebung)
- build: Minifizierte Frontenddateien (für Produktion Umgebung)
- controller: Kontroller für aufgabenspezifische REST APIs
- config: Konfigurationsdateien
- model: Datenbank Module

###Bestes Practices:
- Frontend Struktur: Trennung nach Funktion, module bekommen das suffix '.module.ts'
- Backend Server mit Typescript
- Tests: End2End eigener Ordner, Unit Tests mit funktionalen Dateien






