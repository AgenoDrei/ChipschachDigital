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
- bin: Binary files
- controller: Kontroller für aufgabenspezifische REST APIs
- frontend: Frontend Dateien (nicht minifiziert, für Dev Umgebung)
- frontend\app: Angular files
- frontend\build: Minifizierte & geparste Frontenddateien (für Produktion Umgebung)
- model: Datenbank Module
- typings: TypeScript specs

###Bestes Practices:
- Frontend Struktur: Trennung nach Funktion, module bekommen das suffix '.module.ts'
- Backend Server mit Javascript
- Tests: End2End eigener Ordner, Unit Tests mit funktionalen Dateien
- Master- & Development branch no-ff-merge-only

###Code Conventions:
- Curly braces opening on same line, never omit curly braces
- indention as 4 spaces

## TODO:
- BrowserSync