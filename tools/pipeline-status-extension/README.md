# Todo11 Pipeline Status Extension

En VS Code-extension för att övervaka GitHub Actions pipeline status för Todo11-projektet.

## Funktioner

- **Status Bar Integration**: Visar pipeline status direkt i VS Code's status bar
- **Automatiskt Uppdatering**: Uppdaterar status varje 30 sekunder
- **Snabb Access**: Klicka på status-indikatorn för att öppna pipeline i webbläsaren
- **Färgkodning**: Visuell indikator för status (grön = klar, blå = körs, röd = fel)
- **Keybinding**: `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux) för att köra en manuell check

## Installation

1. Öppna project workspace
2. Navigera till `tools/pipeline-status-extension` mappen
3. Kör `npm install`
4. Kör `npm run vscode:prepublish`
5. Installera extensionen lokalt:
   - Windows/Linux: `code --install-extension todo11-pipeline-status-0.1.0.vsix`
   - Mac: `code-insiders --install-extension todo11-pipeline-status-0.1.0.vsix`

## Användning

Extensionen aktiveras automatiskt i workspace som innehåller `.pipeline-status.json` filen.
Pipeline status visas i status-baren och uppdateras automatiskt.

## Requirements

- VS Code 1.60.0 eller senare
- nodejs v16 eller senare
