# Todo App - Hexagonal Architecture with File-Sync

[![CI/CD Pipeline](https://github.com/cstarendal/todo11/actions/workflows/ci.yml/badge.svg)](https://github.com/cstarendal/todo11/actions/workflows/ci.yml)
[![Latest Commit](https://github.com/cstarendal/todo11/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/cstarendal/todo11/actions/workflows/ci.yml)

En testdriven todo-applikation med hexagonal arkitektur och file-sync för NAS-lagring.

## 🏗️ Arkitektur

**Hexagonal Architecture** med extremt modulär design:

```
packages/
├── domain/                    # Entities, Value Objects (Todo, User)
├── application/               # Use Cases med dependency injection  
├── infrastructure/            # File repositories, encryption, watchers
├── shared/interfaces/         # Platform-agnostic contracts
├── platform/node/             # macOS file system implementation
├── platform/web/              # Browser file API implementation
└── ui-web/                    # React components
```

## 🔄 Storage Strategi

- **File-sync baserat**: JSON-filer i `~/Synology Drive/TodoApp/`
- **Offline-first**: Fungerar utan nätverk, synkar automatiskt
- **Multi-device**: File watchers detekterar ändringar från andra enheter
- **Encryption-ready**: Interfaces förberedda för kryptering

## 🚀 Utvecklingsmetodik

### Test-Driven Development (TDD)
- **100% coverage** - Build fails på mindre än 100%
- **Microscopic commits** - Ett test, en implementation, en refactor per commit
- **Trunk-based development** - Allt direkt till main, inget branching

### CI/CD Pipeline
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Jest unit + integration tests
- ✅ Performance benchmarks (<50ms file ops, <100ms encryption, <1s UI)
- ✅ Auto-merge på grönt build

## 📋 Progression

- [x] **Phase 1**: Core domain (Todo entity) ← *Vi är här*
- [ ] **Phase 2**: Web app (React UI)
- [ ] **Phase 3**: Electron desktop app
- [ ] **Phase 4**: iOS app
- [ ] **Phase 5**: Multi-user + encryption

## 🚦 Pipeline Status Check

För att följa TDD-arbetsflödet är det obligatoriskt att kontrollera pipeline-statusen innan du fortsätter med nästa TDD-cykel. Du har flera alternativ:

1. **Terminal**: 
   - Kör `./check_pipeline.sh` för att kontrollera mot GitHub API
   - Kör `./check_pipeline.sh --mock` för lokalt testläge utan GitHub API
   - Kör `./check_pipeline.sh --jobs` för att visa detaljer om pipeline-jobb
   - Kör `./check_pipeline.sh --jobs --steps` för fullständig information om steg
   - Kör `./pipeline-visualize.sh` för grafisk visning av pipeline-historik

2. **Utvecklingskonsolen**:
   - Kör `./dev.sh` för att öppna utvecklingskonsolen
   - Välj "Kontrollera pipeline-status" för att kontrollera aktuell status
   - Välj "Visualisera pipeline-körningar" för grafisk historik
   - Välj "Pipeline historik" för tabellarisk visning av körningar
   - Välj "Debug pipeline" för att undersöka API-svaret

3. **VS Code Tasks**: 
   - `Tasks: Run Task` → "Check Pipeline Status" - kontrollerar mot GitHub API
   - `Tasks: Run Task` → "Check Pipeline Status (Mock)" - använder testdata
   - `Tasks: Run Task` → "Visualize Pipeline History" - visuell tidslinje
   - `Tasks: Run Task` → "Show Pipeline Details" - detaljerad info om jobb och steg
   - `Tasks: Run Task` → "Open Pipeline in Browser" - öppnar GitHub Actions i webbläsaren

4. **Status Bar**: Med Pipeline Status Extension installerad kan du se status direkt i VS Code's status bar
   - Klicka på statusen i statusraden för att öppna pipeline i webbläsaren
   - Statusen uppdateras automatiskt var 30:e sekund

5. **Kontinuerlig övervakning**:
   - Kör `./pipeline-status.sh` för att starta en monitor som uppdateras var 10:e sekund
   - Kör `./pipeline-status.sh --mock` för testläge utan GitHub API-anrop

![Pipeline Status](https://img.shields.io/github/workflow/status/cstarendal/todo11/CI%2FCD%20Pipeline?label=Pipeline%20Status&style=for-the-badge)

### 🔧 Konfigurera Pipeline-checker

Om du använder ett privat GitHub-repo behöver du konfigurera en GitHub token:

```bash
# Exportera en personlig access token för att få åtkomst till privata repos
export GITHUB_TOKEN="your-personal-access-token"
```

För att ändra reponamn (från standardvärdet `cstarendal/todo11`), använd uppdateringsverktyget:

```bash
# Uppdatera alla filer med det nya reponamnet
./update-repo-name.sh "dittanvändarnamn/dittrepo" 
```

Du kan också manuellt ändra följande filer:
- `scripts/check-pipeline.js` - ändra `REPO` konstanten
- `.vscode/tasks.json` - uppdatera "Open Pipeline in Browser" URL

## 🛠️ Kom igång

```bash
# Klona och installera
git clone https://github.com/cstarendal/todo-app.git
cd todo-app
npm install

# Kör tester
npm test
npm run test:watch
npm run test:coverage

# Build
npm run build

# Linting & formatting
npm run lint
npm run format
```

## 📁 Package Scripts

```bash
# Domain package
cd packages/domain
npm test              # Kör domain tester
npm run build         # Bygg domain package

# Alla packages
npm run test          # Kör alla tester  
npm run build         # Bygg alla packages
```

## 🎯 Quality Gates

- **Test Coverage**: 100% (branches, functions, lines, statements)
- **TypeScript**: Strict mode enabled
- **Performance**: <50ms file operations, <100ms encryption, <1s UI
- **Code Style**: ESLint + Prettier enforced

---

*Byggt med ❤️ enligt hexagonal architecture och TDD principles*
