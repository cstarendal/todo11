#!/bin/bash
# filepath: /Users/cstarendal/Resilio Sync/Code/TODO 11/quickstart.sh

# Quickstart guide för pipeline-övervakningssystemet
# Användning: ./quickstart.sh

# Färger
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
MAGENTA="\033[0;35m"
CYAN="\033[0;36m"
RESET="\033[0m"
BOLD="\033[1m"

# Banner
echo -e "${BOLD}${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                TODO11 PIPELINE QUICKSTART                  ║"
echo "╚════════════════════════════════════════════════════════════╝${RESET}"

# Kontrollera om repo är konfigurerat
check_repo_config() {
  echo -e "\n${BOLD}${CYAN}Steg 1: Kontrollerar repokonfiguration${RESET}\n"

  # Hämta reponamn från remote, fallback på default
  REMOTE_URL=$(git config --get remote.origin.url 2>/dev/null || echo "")
  
  if [ -z "$REMOTE_URL" ]; then
    echo -e "${YELLOW}⚠️ Inget git remote hittat.${RESET}"
    echo -e "${YELLOW}Standard reponamn 'cstarendal/todo11' kommer att användas.${RESET}"
    echo -e "${YELLOW}Du kan uppdatera detta senare med './update-repo-name.sh nytt/repo'${RESET}"
  else
    # Extrahera reponamn från git remote URL
    REPO_NAME=$(echo "$REMOTE_URL" | sed -E 's|.*github.com[:/]([^/]+/[^/.]+).*|\1|')
    echo -e "${GREEN}✓ Git remote hittad: $REPO_NAME${RESET}"
    
    # Kontrollera om det skiljer sig från standard
    if [ "$REPO_NAME" != "cstarendal/todo11" ]; then
      echo -e "\n${YELLOW}⚠️ Ditt reponamn '$REPO_NAME' skiljer sig från standardnamnet 'cstarendal/todo11'.${RESET}"
      echo -e "${YELLOW}Vill du uppdatera alla konfigurationsfiler med ditt reponamn? (j/n)${RESET}"
      read -r answer
      if [[ "$answer" =~ ^[Jj] ]]; then
        ./update-repo-name.sh "$REPO_NAME"
      else
        echo -e "${YELLOW}Hoppar över uppdatering. Du kan uppdatera senare med './update-repo-name.sh $REPO_NAME'${RESET}"
      fi
    fi
  fi
}

# Kontrollera GitHub token
check_github_token() {
  echo -e "\n${BOLD}${CYAN}Steg 2: Kontrollerar GitHub token${RESET}\n"
  
  if [ -n "$GITHUB_TOKEN" ]; then
    echo -e "${GREEN}✓ GITHUB_TOKEN miljövariabel är satt.${RESET}"
  else
    echo -e "${YELLOW}⚠️ Ingen GITHUB_TOKEN hittad.${RESET}"
    echo -e "${YELLOW}För att använda pipeline-övervakning med privata repon behövs en GitHub token.${RESET}"
    echo -e "${YELLOW}För publika repon är detta inte nödvändigt men rekommenderas för att undvika rate-limiting.${RESET}"
    echo -e "\n${YELLOW}Instruktioner för att skapa en GitHub token:${RESET}"
    echo -e "  1. Gå till https://github.com/settings/tokens"
    echo -e "  2. Klicka på 'Generate new token'"
    echo -e "  3. Välj 'workflow' scope"
    echo -e "  4. Klicka på 'Generate token'"
    echo -e "  5. Kör följande kommando med din token:"
    echo -e "     ${CYAN}export GITHUB_TOKEN=\"din-token-här\"${RESET}"
    echo -e "  6. För permanent lagring, lägg till raden i ~/.zshrc eller ~/.bash_profile"
    
    echo -e "\n${YELLOW}Vill du testa systemet i mock-läge istället? (j/n)${RESET}"
    read -r answer
    if [[ "$answer" =~ ^[Jj] ]]; then
      echo -e "${GREEN}✓ Bra! Vi fortsätter med mock-läge.${RESET}"
      USE_MOCK=true
    else
      echo -e "${YELLOW}⚠️ Utan GitHub token kan API-anrop bli rate-limiterade.${RESET}"
    fi
  fi
}

# Visa demo
show_demo() {
  echo -e "\n${BOLD}${CYAN}Steg 3: Demonstration av pipeline-övervakning${RESET}\n"
  
  if [ "$USE_MOCK" = true ]; then
    echo -e "${YELLOW}Kör i mock-läge...${RESET}\n"
    ./check_pipeline.sh --mock
  else
    echo -e "${YELLOW}Kontrollerar pipeline-status...${RESET}\n"
    ./check_pipeline.sh
  fi
  
  echo -e "\n${BOLD}${CYAN}Vad vill du testa härnäst?${RESET}\n"
  echo -e "1. Visa pipeline-visualisering"
  echo -e "2. Öppna utvecklarkonsolen (dev.sh)"
  echo -e "3. Visa detaljerade pipeline-jobb"
  echo -e "4. Starta kontinuerlig övervakning"
  echo -e "5. Läs dokumentation"
  echo -e "0. Avsluta quickstart"
  
  read -r choice
  case $choice in
    1)
      echo -e "\n${YELLOW}Visar pipeline-visualisering...${RESET}\n"
      if [ "$USE_MOCK" = true ]; then
        USE_MOCK_DATA=true node tools/pipeline-visualizer.js
      else
        node tools/pipeline-visualizer.js
      fi
      ;;
    2)
      echo -e "\n${YELLOW}Startar utvecklarkonsolen...${RESET}\n"
      ./dev.sh
      exit 0
      ;;
    3)
      echo -e "\n${YELLOW}Visar detaljerade pipeline-jobb...${RESET}\n"
      if [ "$USE_MOCK" = true ]; then
        ./check_pipeline.sh --mock --jobs
      else
        ./check_pipeline.sh --jobs
      fi
      ;;
    4)
      echo -e "\n${YELLOW}Startar kontinuerlig övervakning...${RESET}\n"
      echo -e "${YELLOW}(Tryck Ctrl+C för att avsluta)${RESET}\n"
      if [ "$USE_MOCK" = true ]; then
        ./pipeline-status.sh --mock
      else
        ./pipeline-status.sh
      fi
      exit 0
      ;;
    5)
      echo -e "\n${YELLOW}Öppnar dokumentation...${RESET}\n"
      if command -v code >/dev/null 2>&1; then
        code docs/pipeline-monitoring.md
      else
        echo -e "${RED}VS Code hittades inte. Öppna manuellt:${RESET}"
        echo -e "${CYAN}docs/pipeline-monitoring.md${RESET}"
      fi
      ;;
    0|*)
      echo -e "\n${GREEN}Quickstart avslutad. Lycka till med TDD-utveckling!${RESET}"
      exit 0
      ;;
  esac
}

# Slutsummering
show_summary() {
  echo -e "\n${BOLD}${CYAN}════ QUICKSTART SAMMANFATTNING ════${RESET}\n"
  echo -e "Du har nu konfigurerat och testat pipeline-övervakningssystemet."
  echo -e "Här är de viktigaste kommandona att komma ihåg:\n"
  
  echo -e "${BOLD}${CYAN}Pipeline-kontroll:${RESET}"
  echo -e "  ${CYAN}./check_pipeline.sh${RESET} - Kontrollera current commit pipeline-status"
  echo -e "  ${CYAN}./dev.sh${RESET} - Öppna utvecklarkonsolen för alla verktyg"
  echo -e "  ${CYAN}./pipeline-status.sh${RESET} - Starta kontinuerlig övervakning\n"
  
  echo -e "${BOLD}${CYAN}Visualisering:${RESET}"
  echo -e "  ${CYAN}./pipeline-visualize.sh${RESET} - Visa pipeline-historik grafiskt\n"
  
  echo -e "${BOLD}${CYAN}VS Code Integration:${RESET}"
  echo -e "  Kör VS Code Task 'Check Pipeline Status'"
  echo -e "  Installera Pipeline Status Extension: ${CYAN}./dev.sh${RESET} och välj alternativ 9\n"
  
  echo -e "${BOLD}${CYAN}För mer hjälp:${RESET}"
  echo -e "  Läs ${CYAN}docs/pipeline-monitoring.md${RESET} för fullständig dokumentation"
  echo -e "  Kör ${CYAN}./demo-pipeline-tools.sh${RESET} för en interaktiv demonstration\n"
}

# Main
check_repo_config
check_github_token
show_demo
show_summary
