#!/bin/bash
# Pipeline Guardian - Automatisk pipeline-övervakare och problemlösare
# Körs kontinuerligt och fixar pipeline-problem automatiskt

# Färger
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
MAGENTA="\033[0;35m"
CYAN="\033[0;36m"
RESET="\033[0m"
BOLD="\033[1m"

# Konfiguration
MONITOR_INTERVAL=15  # Sekunder mellan kontroller
MAX_FIX_ATTEMPTS=3   # Max antal försök att fixa samma problem
LOG_FILE=".pipeline-guardian.log"

# Räknare för problemlösning
declare -A fix_attempts

# Loggfunktion
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# Banner
show_banner() {
    clear
    echo -e "${BOLD}${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                  PIPELINE GUARDIAN 🛡️                     ║"
    echo "║              Automatisk Pipeline-övervakare                ║"
    echo "╚════════════════════════════════════════════════════════════╝${RESET}"
    echo -e "${CYAN}🤖 Jag övervakar din pipeline och fixar problem automatiskt${RESET}\n"
}

# Kontrollera pipeline status
check_pipeline_status() {
    log "INFO" "Kontrollerar pipeline status..."
    
    # Kör pipeline check och fånga output
    local output
    output=$(node scripts/check-pipeline.js --json 2>/dev/null)
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        # Pipeline grön
        echo -e "${GREEN}✅ Pipeline GRÖN${RESET}"
        log "SUCCESS" "Pipeline är grön"
        return 0
    else
        # Pipeline har problem
        echo -e "${RED}❌ Pipeline har problem${RESET}"
        log "ERROR" "Pipeline misslyckad med exit code: $exit_code"
        return 1
    fi
}

# Analysera och fixa TypeScript-problem
fix_typescript_issues() {
    log "INFO" "Analyserar TypeScript-problem..."
    
    # Testa lokal TypeScript kompilering
    if ! npx tsc --build >/dev/null 2>&1; then
        log "ERROR" "TypeScript kompileringsfel upptäckt"
        
        # Rensa build-artefakter
        log "INFO" "Rensar TypeScript build-artefakter..."
        find . -name "*.tsbuildinfo" -delete
        find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
        
        # Försök bygga igen
        if npx tsc --build; then
            log "SUCCESS" "TypeScript-problem löst genom att rensa build-artefakter"
            return 0
        else
            log "ERROR" "TypeScript-problem kvarstår efter clean"
            return 1
        fi
    fi
    
    return 0
}

# Fixa npm dependency-problem
fix_dependency_issues() {
    log "INFO" "Kontrollerar npm dependencies..."
    
    # Kontrollera om package-lock.json är synkroniserad
    if ! npm ci >/dev/null 2>&1; then
        log "ERROR" "npm ci misslyckades, försöker npm install"
        
        if npm install; then
            log "SUCCESS" "Dependencies uppdaterade med npm install"
            
            # Committa uppdaterad package-lock.json om den ändrats
            if git diff --name-only | grep -q "package-lock.json"; then
                log "INFO" "Commitar uppdaterad package-lock.json"
                git add package-lock.json
                git commit -m "fix: Automatisk uppdatering av package-lock.json

- Synkroniserad av Pipeline Guardian 🛡️
- Löser dependency-konflikter automatiskt"
                
                if git push; then
                    log "SUCCESS" "Uppdaterad package-lock.json pushad till remote"
                    return 0
                else
                    log "ERROR" "Kunde inte pusha package-lock.json uppdatering"
                    return 1
                fi
            fi
            return 0
        else
            log "ERROR" "npm install misslyckades"
            return 1
        fi
    fi
    
    return 0
}

# Fixa linting-problem
fix_linting_issues() {
    log "INFO" "Kontrollerar och fixar linting-problem..."
    
    # Försök auto-fix med ESLint
    if npm run lint -- --fix >/dev/null 2>&1; then
        # Kontrollera om filer ändrades
        if ! git diff --quiet; then
            log "INFO" "Auto-fixade linting-problem"
            git add .
            git commit -m "fix: Automatisk linting-fix

- Auto-fixade av Pipeline Guardian 🛡️
- ESLint --fix applicerat"
            
            if git push; then
                log "SUCCESS" "Linting-fixes pushade till remote"
                return 0
            fi
        fi
    fi
    
    return 0
}

# Huvudfunktion för problemlösning
attempt_fix() {
    local problem_type="$1"
    local fix_key="$problem_type"
    
    # Kontrollera antal försök
    if [ "${fix_attempts[$fix_key]:-0}" -ge $MAX_FIX_ATTEMPTS ]; then
        log "WARNING" "Max försök nått för $problem_type, hoppar över"
        return 1
    fi
    
    # Öka räknare
    ((fix_attempts[$fix_key]++))
    
    echo -e "${YELLOW}🔧 Försöker fixa: $problem_type (försök ${fix_attempts[$fix_key]}/$MAX_FIX_ATTEMPTS)${RESET}"
    
    case "$problem_type" in
        "dependencies")
            fix_dependency_issues
            ;;
        "typescript")
            fix_typescript_issues
            ;;
        "linting")
            fix_linting_issues
            ;;
        *)
            log "ERROR" "Okänd problemtyp: $problem_type"
            return 1
            ;;
    esac
}

# Övervakningsloop
monitor_loop() {
    log "INFO" "Startar Pipeline Guardian övervakningsloop"
    
    while true; do
        echo -e "\n${CYAN}🔍 Kontrollerar pipeline $(date '+%H:%M:%S')...${RESET}"
        
        if check_pipeline_status; then
            # Pipeline är grön
            echo -e "${GREEN}😊 Allt ser bra ut! Vilandes i $MONITOR_INTERVAL sekunder...${RESET}"
            
            # Nollställ räknare när allt fungerar
            unset fix_attempts
            declare -A fix_attempts
        else
            # Pipeline har problem - försök fixa
            echo -e "${RED}😰 Pipeline-problem upptäckt! Försöker lösa automatiskt...${RESET}"
            
            # Försök olika fix-strategier
            attempt_fix "dependencies"
            sleep 5
            attempt_fix "typescript" 
            sleep 5
            attempt_fix "linting"
            
            echo -e "${BLUE}⏳ Väntar på nästa pipeline-körning...${RESET}"
        fi
        
        sleep $MONITOR_INTERVAL
    done
}

# Cleanup på exit
cleanup() {
    log "INFO" "Pipeline Guardian avslutas"
    echo -e "\n${YELLOW}👋 Pipeline Guardian avstängd${RESET}"
    exit 0
}

# Registrera cleanup-funktion
trap cleanup SIGINT SIGTERM

# Huvudprogram
main() {
    show_banner
    
    # Kontrollera att vi är i rätt directory
    if [ ! -f "package.json" ] || [ ! -d ".git" ]; then
        echo -e "${RED}❌ Måste köras från projektets root-directory${RESET}"
        exit 1
    fi
    
    # Kontrollera att GitHub token finns
    if [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${YELLOW}⚠️  GITHUB_TOKEN ej satt, vissa funktioner kan vara begränsade${RESET}"
    fi
    
    log "INFO" "Pipeline Guardian startar övervaknings"
    echo -e "${GREEN}🚀 Startar automatisk pipeline-övervakning...${RESET}"
    echo -e "${CYAN}Tryck Ctrl+C för att avsluta${RESET}\n"
    
    monitor_loop
}

# Kör huvudprogram
main "$@"
