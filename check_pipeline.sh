#!/bin/bash

# Script för att kontrollera CI/CD pipeline status för senaste commit
# Användning: ./check_pipeline.sh

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
echo "║                   TASK11 PIPELINE CHECK                    ║"
echo "╚════════════════════════════════════════════════════════════╝${RESET}"

# Process command-line arguments
ARGS=""

# Hjälpmeddelande
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
  echo -e "${CYAN}Användning: ./check_pipeline.sh [alternativ]${RESET}"
  echo -e "${CYAN}Alternativ:${RESET}"
  echo "  --mock       Använd mockdata istället för GitHub API"
  echo "  --jobs       Visa detaljerad information om jobb"
  echo "  --steps      Visa detaljerad information om steg i varje jobb"
  echo "  --debug      Visa rådata från API-anrop för felsökning"
  exit 0
fi

# Samla alla argument
for arg in "$@"; do
  ARGS="$ARGS $arg"
done

# Kör Node.js scriptet för att hämta pipeline status med alla argument
node scripts/check-pipeline.js$ARGS

# Spara exit code
EXIT_CODE=$?

# Om pipeline är grön, visa TDD-cykelns nästa steg
if [ $EXIT_CODE -eq 0 ]; then
  echo -e "\n${BOLD}${GREEN}╔════════════════════════════════════════════════════════════╗"
  echo "║                   NÄSTA TDD-CYKEL STEG                     ║"
  echo "╠════════════════════════════════════════════════════════════╣"
  echo "║ 1. Skriv ett nytt test (RED)                              ║"
  echo "║ 2. Implementera minimal kod (GREEN)                       ║"
  echo "║ 3. Refaktorera koden (REFACTOR)                           ║"
  echo "║ 4. Commit varje steg separat                              ║"
  echo "╚════════════════════════════════════════════════════════════╝${RESET}"
fi

exit $EXIT_CODE
