#!/bin/bash
# filepath: /Users/cstarendal/Resilio Sync/Code/TODO 11/update-repo-name.sh

# Script för att uppdatera repo-namnet i alla filer
# Användning: ./update-repo-name.sh "nytt/reponamn"

# Färger
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
MAGENTA="\033[0;35m"
CYAN="\033[0;36m"
RESET="\033[0m"
BOLD="\033[1m"

# Kontrollera att ett reponamn angetts
if [ -z "$1" ]; then
  echo -e "${RED}Error: Inget reponamn angivet.${RESET}"
  echo -e "Användning: ./update-repo-name.sh \"username/reponame\""
  exit 1
fi

NEW_REPO="$1"
OLD_REPO="cstarendal/todo11"

# Banner
echo -e "${BOLD}${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  UPPDATERA REPONAMN                       ║"
echo "╚════════════════════════════════════════════════════════════╝${RESET}"
echo -e "\n${BOLD}${CYAN}Ändrar reponamn från:${RESET} $OLD_REPO ${BOLD}${CYAN}till:${RESET} $NEW_REPO\n"

# Bekräftelse
read -p "Är du säker på att du vill fortsätta? (j/n) " CONFIRM
if [[ "$CONFIRM" != [jJ]* ]]; then
  echo -e "\n${YELLOW}Avbryter på användarens begäran.${RESET}"
  exit 0
fi

echo -e "\n${BOLD}${CYAN}Uppdaterar filer...${RESET}\n"

# Lista över filer att uppdatera
FILES_TO_UPDATE=(
  "scripts/check-pipeline.js"
  "dev.sh" 
  ".vscode/tasks.json"
  "tools/pipeline-status-extension/extension.js"
  "check_pipeline.sh"
  "pipeline-status.sh"
  "tools/pipeline-visualizer.js"
)

# Uppdatera varje fil
for FILE in "${FILES_TO_UPDATE[@]}"; do
  if [ -f "$FILE" ]; then
    echo -e "Uppdaterar ${CYAN}$FILE${RESET}..."
    # Använd sed för att ersätta alla förekomster av gamla reponamnet
    sed -i '' "s|$OLD_REPO|$NEW_REPO|g" "$FILE"
    # Kontrollera om något ändrades
    if grep -q "$NEW_REPO" "$FILE"; then
      echo -e "${GREEN}✓${RESET} Framgångsrikt uppdaterad."
    else
      echo -e "${YELLOW}⚠${RESET} Ingen ändring gjordes (reponamn hittades inte)."
    fi
  else
    echo -e "${RED}✗${RESET} Filen $FILE hittades inte, hoppar över."
  fi
done

echo -e "\n${BOLD}${GREEN}Klar!${RESET} Reponamnet har uppdaterats i alla relevanta filer."
echo -e "\nFör att testa ändringarna, kör:"
echo -e "${CYAN}./dev.sh pipeline${RESET}\n"
