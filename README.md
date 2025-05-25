# Todo App - Hexagonal Architecture with File-Sync

[![CI/CD Pipeline](https://github.com/cstarendal/todo-app/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/cstarendal/todo-app/actions)
[![codecov](https://codecov.io/gh/cstarendal/todo-app/branch/main/graph/badge.svg)](https://codecov.io/gh/cstarendal/todo-app)

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
