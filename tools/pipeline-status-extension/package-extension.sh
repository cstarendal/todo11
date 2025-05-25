#!/bin/bash
# filepath: /Users/cstarendal/Resilio Sync/Code/TODO 11/tools/pipeline-status-extension/package-extension.sh

# Skript för att bygga och installera VS Code-extensionen lokalt

echo "📦 Bygger Todo11 Pipeline Status Extension..."

# Kontrollera om vsix-paketeraren finns
if ! command -v vsce &> /dev/null; then
  echo "Installerar @vscode/vsce..."
  npm install -g @vscode/vsce
fi

# Installera beroenden
echo "Installerar beroenden..."
npm install

# Skapa VSIX-paket
echo "Skapar VSIX-paket..."
vsce package

# Hitta senaste VSIX-filen
VSIX_FILE=$(ls -t todo11-pipeline-status-*.vsix 2>/dev/null | head -n 1)

if [ -z "$VSIX_FILE" ]; then
  echo "❌ Kunde inte hitta någon VSIX-fil. Bygget misslyckades."
  exit 1
fi

echo "✅ VSIX-paket skapat: $VSIX_FILE"

# Fråga om användaren vill installera extensionen
read -p "Vill du installera extensionen i VS Code? (y/n): " INSTALL

if [[ $INSTALL == "y" || $INSTALL == "Y" ]]; then
  echo "Installerar extensionen..."
  
  # Kontrollera om code eller code-insiders finns
  if command -v code &> /dev/null; then
    code --install-extension "$VSIX_FILE"
  elif command -v code-insiders &> /dev/null; then
    code-insiders --install-extension "$VSIX_FILE"
  else
    echo "❌ Kunde inte hitta VS Code eller VS Code Insiders. Installera manuellt med:"
    echo "code --install-extension $VSIX_FILE"
  fi
  
  echo "✅ Extension installerad! Starta om VS Code för att aktivera."
else
  echo "För att installera manuellt, kör:"
  echo "code --install-extension $VSIX_FILE"
fi
