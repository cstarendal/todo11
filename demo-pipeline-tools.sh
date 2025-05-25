#!/bin/bash
# filepath: /Users/cstarendal/Resilio Sync/Code/TASK 11/demo-pipeline-tools.sh

# Demo av olika pipeline-övervakningsverktyg
# Användning: ./demo-pipeline-tools.sh

# Färger
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
MAGENTA="\033[0;35m"
CYAN="\033[0;36m"
RESET="\033[0m"
BOLD="\033[1m"

clear
echo -e "${BOLD}${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║            TASK11 PIPELINE TOOLS DEMONSTRATION             ║"
echo "╚════════════════════════════════════════════════════════════╝${RESET}"

# Funktioner
demo_basic_check() {
  echo -e "\n${BOLD}${CYAN}1. Grundläggande pipeline-kontroll${RESET}"
  echo -e "${CYAN}----------------------------${RESET}"
  echo -e "Kör: ./check_pipeline.sh --mock\n"
  ./check_pipeline.sh --mock
  echo -e "\n${YELLOW}Detta är ett exempel på hur pipeline-statusen ser ut i mock-läge.${RESET}"
  echo -e "${YELLOW}I verkligt läge skulle detta kontrollera mot GitHub API.${RESET}"
  read -p "Tryck ENTER för att fortsätta..."
}

demo_red_pipeline_warning() {
  echo -e "\n${BOLD}${RED}⚠️  Pipeline-status: MISSLYCKAD (RED)${RESET}"
  echo -e "${RED}Du kan INTE gå vidare till nästa TDD-cykel förrän pipelinen är grön!${RESET}"
  echo -e "${YELLOW}Åtgärda felen och kör om testerna innan du committar igen.${RESET}"
  read -p "Tryck ENTER för att fortsätta..."
}

demo_detailed_check() {
  echo -e "\n${BOLD}${CYAN}2. Detaljerad pipeline-kontroll${RESET}"
  echo -e "${CYAN}----------------------------${RESET}"
  echo -e "Kör: ./check_pipeline.sh --mock --jobs\n"
  ./check_pipeline.sh --mock --jobs
  echo -e "\n${YELLOW}Detta visar detaljinformation om jobb i pipeline.${RESET}"
  echo -e "${YELLOW}Med --steps tillägget visas också steg-för-steg information.${RESET}"
  read -p "Tryck ENTER för att fortsätta..."
}

demo_visualization() {
  echo -e "\n${BOLD}${CYAN}3. Pipeline-visualisering${RESET}"
  echo -e "${CYAN}---------------------${RESET}"
  echo -e "Kör: ./pipeline-visualize.sh (simulerad output)\n"
  
  # Simulera output från visualiseringsverktyget
  echo -e "${BOLD}${BLUE}╔══════════════════ Pipeline Historik ══════════════════╗${RESET}"
  echo -e "${BOLD}${BLUE}║ Symbolförklaring:                                     ║${RESET}"
  echo -e "${BOLD}${BLUE}║${RESET} ${GREEN}●${RESET} Lyckad  ${RED}●${RESET} Misslyckad  ${BLUE}●${RESET} Pågående  ${YELLOW}●${RESET} Avbruten       ${BOLD}${BLUE}║${RESET}"
  echo -e "${BOLD}${BLUE}╠══════════════════════════════════════════════════════╣${RESET}"
  echo -e "${BOLD}${BLUE}║${RESET} ${GREEN}●${RESET} 2023-05-25 14:30:21 - abc1234 ${BOLD}${GREEN}(aktuell)${RESET}"
  echo -e "${BOLD}${BLUE}║${RESET}   ${CYAN}CI/CD Pipeline${RESET}"
  echo -e "${BOLD}${BLUE}║${RESET}   Status: ${GREEN}Completed${RESET}, Result: ${GREEN}Success✓${RESET}"
  echo -e "${BOLD}${BLUE}║${RESET}   │"
  echo -e "${BOLD}${BLUE}║${RESET} ${GREEN}●${RESET} 2023-05-25 14:15:33 - def5678"
  echo -e "${BOLD}${BLUE}║${RESET}   ${CYAN}CI/CD Pipeline${RESET}"
  echo -e "${BOLD}${BLUE}║${RESET}   Status: ${GREEN}Completed${RESET}, Result: ${GREEN}Success✓${RESET}"
  echo -e "${BOLD}${BLUE}║${RESET}   │"
  echo -e "${BOLD}${BLUE}║${RESET} ${RED}●${RESET} 2023-05-25 14:00:12 - ghi9012"
  echo -e "${BOLD}${BLUE}║${RESET}   ${CYAN}CI/CD Pipeline${RESET}"
  echo -e "${BOLD}${BLUE}║${RESET}   Status: ${GREEN}Completed${RESET}, Result: ${RED}Failed✗${RESET}"
  echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════╝${RESET}"
  
  echo -e "\n${YELLOW}Detta är en simulerad visualisering av pipeline-historiken.${RESET}"
  echo -e "${YELLOW}I verkligt läge hämtas data från GitHub API.${RESET}"
  read -p "Tryck ENTER för att fortsätta..."
}

demo_dev_console() {
  echo -e "\n${BOLD}${CYAN}4. Utvecklarkonsolen${RESET}"
  echo -e "${CYAN}---------------------${RESET}"
  echo -e "Kör: ./dev.sh (visar menyn)\n"
  
  # Simulera menu från dev.sh
  echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════════════╗"
  echo "║                TASK11 UTVECKLINGSKONSOL                    ║"
  echo "╚════════════════════════════════════════════════════════════╝${RESET}"
  echo -e "${BOLD}${CYAN}Användare:${RESET} Demo User"
  echo -e "${BOLD}${CYAN}Projekt:${RESET} TASK 11"
  echo -e "${BOLD}${CYAN}Branch:${RESET} main | ${BOLD}${CYAN}Commit:${RESET} abc1234"
  echo -e "${BOLD}${CYAN}Datum:${RESET} 2023-05-25 15:00:00"
  echo -e "${BOLD}${CYAN}──────────────────────────────────────────────────────────────${RESET}\n"
  
  echo -e "${BOLD}${CYAN}Välj en åtgärd:${RESET}"
  echo -e "${BOLD}1.${RESET} Kontrollera pipeline-status"
  echo -e "${BOLD}2.${RESET} Kontrollera pipeline-status (mock-läge)"
  echo -e "${BOLD}3.${RESET} Öppna pipeline i webbläsaren"
  echo -e "${BOLD}4.${RESET} Kör tester"
  echo -e "${BOLD}5.${RESET} Kör linting"
  echo -e "${BOLD}6.${RESET} Bygg alla paket"
  echo -e "${BOLD}7.${RESET} Projektöversikt"
  echo -e "${BOLD}8.${RESET} Kommitguide (TDD)"
  echo -e "${BOLD}9.${RESET} Installera VS Code Pipeline Extension"
  echo -e "${BOLD}P.${RESET} Pipeline historik (senaste körningar)"
  echo -e "${BOLD}V.${RESET} Visualisera pipeline-körningar"
  echo -e "${BOLD}D.${RESET} Debug pipeline (visa API-svar)"
  echo -e "${BOLD}0.${RESET} Avsluta\n"
  
  echo -e "${YELLOW}Utvecklarkonsolen är navet i workflow-hanteringen.${RESET}"
  echo -e "${YELLOW}Härifrån kan alla pipeline-verktyg startas.${RESET}"
  read -p "Tryck ENTER för att fortsätta..."
}

demo_continuous_monitoring() {
  echo -e "\n${BOLD}${CYAN}5. Kontinuerlig övervakning${RESET}"
  echo -e "${CYAN}---------------------------${RESET}"
  echo -e "Kör: ./pipeline-status.sh (kör automatiskt var 10:e sekund)\n"
  
  echo -e "╔════════════════════════════════════════════════════════════╗"
  echo -e "║                 PIPELINE STATUS MONITOR                    ║"
  echo -e "╚════════════════════════════════════════════════════════════╝"
  echo -e "  Uppdateras var 10:e sekund. Tryck Ctrl+C för att avsluta."
  echo -e ""
  echo -e "${BOLD}${BLUE}🔍 Checking pipeline status for commit:${RESET} abc1234def"
  echo -e "\n${BOLD}━━━━━━━━━ Pipeline Status ━━━━━━━━━${RESET}"
  echo -e "${BOLD}Workflow:${RESET} CI/CD Pipeline"
  echo -e "${BOLD}Status:${RESET} ${GREEN}Completed${RESET}"
  echo -e "${BOLD}Result:${RESET} ${GREEN}Success✓${RESET}"
  echo -e "${BOLD}Commit:${RESET} abc1234 ${GREEN}(current)${RESET}"
  echo -e "${BOLD}Updated:${RESET} 2023-05-25 14:30:21"
  echo -e "${BOLD}Details:${RESET} https://github.com/cstarendal/task11/actions/runs/123456789"
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n"
  echo -e "${BOLD}${GREEN}✅ Pipeline GRÖN - Säkert att fortsätta med nästa TDD-cykel!${RESET}"
  
  echo -e "\n${YELLOW}Detta är en simulerad kontinuerlig övervakning.${RESET}"
  echo -e "${YELLOW}I verkligt läge uppdateras denna vy automatiskt var 10:e sekund.${RESET}"
  read -p "Tryck ENTER för att fortsätta..."
}

demo_vscode_extension() {
  echo -e "\n${BOLD}${CYAN}6. VS Code Integration${RESET}"
  echo -e "${CYAN}---------------------${RESET}"
  echo -e "VS Code status bar med pipeline-status:\n"
  
  # Simulera VS Code statusbar
  echo -e "┌───────────────────────────────────────────────────┐"
  echo -e "│                                                   │"
  echo -e "│  ${GREEN}$(check) Pipeline: Success${RESET}                           │"
  echo -e "│                                                   │"
  echo -e "└───────────────────────────────────────────────────┘"
  
  echo -e "\n${YELLOW}VS Code extensionen visar pipeline-statusen direkt i statusraden.${RESET}"
  echo -e "${YELLOW}Klicka på statusen öppnar pipeline i webbläsaren.${RESET}"
  read -p "Tryck ENTER för att fortsätta..."
}

demo_repo_update() {
  echo -e "\n${BOLD}${CYAN}7. Uppdatering av reponamn${RESET}"
  echo -e "${CYAN}-------------------------${RESET}"
  echo -e "Kör: ./update-repo-name.sh \"nytt/reponamn\"\n"
  
  echo -e "${BOLD}${BLUE}"
  echo -e "╔════════════════════════════════════════════════════════════╗"
  echo -e "║                  UPPDATERA REPONAMN                       ║"
  echo -e "╚════════════════════════════════════════════════════════════╝${RESET}"
  echo -e "\n${BOLD}${CYAN}Ändrar reponamn från:${RESET} cstarendal/task11 ${BOLD}${CYAN}till:${RESET} nytt/reponamn\n"
  
  echo -e "${YELLOW}Detta verktyg uppdaterar automatiskt reponamnet i alla skript.${RESET}"
  echo -e "${YELLOW}Det är användbart när du förkar eller flyttar projektet.${RESET}"
  read -p "Tryck ENTER för att fortsätta..."
}

# Demo summary
demo_summary() {
  echo -e "\n${BOLD}${BLUE}╔════════════════════════════════════════════════════════════╗"
  echo -e "║                   SAMMANFATTNING                          ║"
  echo -e "╚════════════════════════════════════════════════════════════╝${RESET}\n"
  
  echo -e "${BOLD}${GREEN}Alla dessa verktyg hjälper dig att:${RESET}\n"
  echo -e "1. ${CYAN}Övervaka pipeline-status${RESET} för varje commit"
  echo -e "2. ${CYAN}Visualisera pipeline-historik${RESET} över tid"
  echo -e "3. ${CYAN}Se detaljerad information${RESET} om jobb och steg"
  echo -e "4. ${CYAN}Debugga API-anrop${RESET} för att förstå problem"
  echo -e "5. ${CYAN}Få kontinuerliga uppdateringar${RESET} i realtid"
  echo -e "6. ${CYAN}Se status direkt i VS Code${RESET} via statusraden"
  echo -e "7. ${CYAN}Enkelt uppdatera reponamn${RESET} när du byter repository\n"
  
  echo -e "${BOLD}${GREEN}Detta säkerställer att TDD-cykeln:${RESET}"
  echo -e "  ${RED}RED${RESET} → ${GREEN}GREEN${RESET} → ${BLUE}REFACTOR${RESET} → ${YELLOW}PIPELINE-CHECK${RESET}"
  echo -e "alltid följs och att pipeline alltid är grön innan nästa cykel påbörjas.\n"
  
  echo -e "${BOLD}${BLUE}Tack för att du testade pipeline-verktygen!${RESET}\n"
}

# Kör alla demo-steg
demo_basic_check
demo_red_pipeline_warning
clear
demo_detailed_check
clear
demo_visualization
clear
demo_dev_console
clear
demo_continuous_monitoring
clear
demo_vscode_extension
clear
demo_repo_update
clear
demo_summary
