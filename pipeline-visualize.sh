#!/bin/bash
# filepath: /Users/cstarendal/Resilio Sync/Code/TODO 11/pipeline-visualize.sh

# Script för att visualisera pipeline-historik
# Användning: ./pipeline-visualize.sh [--all]

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
echo "║                 TODO11 PIPELINE VISUALIZER                 ║"
echo "╚════════════════════════════════════════════════════════════╝${RESET}"

# Kontrollera om --all flaggan är angiven
if [ "$1" == "--all" ]; then
  # Visa alla pipelines
  node tools/pipeline-visualizer.js --all
else
  # Visa standard antal pipelines
  node tools/pipeline-visualizer.js
fi

# Fråga användaren om de vill visa mer detaljer
echo -e "\n${BOLD}${CYAN}Vill du se mer detaljerad information om en specifik körning? (j/n)${RESET}"
read -r answer

if [[ "$answer" =~ ^[Jj] ]]; then
  echo -e "\n${BOLD}${CYAN}Hämtar detaljer för senaste pipeline-körningen...${RESET}\n"
  ./check_pipeline.sh --jobs --steps
fi
