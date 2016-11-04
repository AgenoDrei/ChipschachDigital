#ChipschachDigital

Zweite Auflage von Chipschach mit verbessertem responsive Design, verbesserter Server Nutzung und einem ausgereiften Build System.

Entwickler: Simon Müller, Oliver Berg

###Architectural Decisions:
- Server Framework: express, JS
- Build Framework: grunt
- Frontend Framework: angular2 
- Database: mongoDB
- Tests: unbestimmt

###Folder Structure:
- bin: Binary files
- config: Config files (e.g. DB)
- controller: Controller for REST APIs
- frontend: frontend-files (not minified, for dev environment)
- frontend\app: Angular files
- frontend\build: Minified & parsed frontend-files (--> production)
- model: Database model
- typings: TypeScript specs

###Best Practices:
- Frontend structure: Separation by function, moduls get suffix '.module.ts', components get '.component.ts', etc.
- Tests: End2End own folder, Unit Tests with functional files
- Git: Master- & Development branch no-ff-merge-only, features named after current task **#SIMON_KNOWS_WHY**

###Code Conventions:
- Curly braces opening on same line, never omit curly braces
- indention as 4 spaces

## TODO:
- LESS/SASS
-- Consider Pflichtenheft (siehe treffen auf burg) to do
- favicon
- Make CSS beautifull again