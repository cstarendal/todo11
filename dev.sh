#!/bin/bash
# filepath: /Users/cstarendal/Resilio Sync/Code/TODO 11/dev.sh

# Task11 - Utvecklarkontrollpanel
# Användning: ./dev.sh [kommando]

# Färger
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
MAGENTA="\033[0;35m"
CYAN="\033[0;36m"
RESET="\033[0m"
BOLD="\033[1m"

# Hämta commitstatus
CURRENT_COMMIT=$(git rev-parse --short HEAD)
BRANCH=$(git branch --show-current)
REPO_PATH=$(git rev-parse --show-toplevel)
REPO_NAME=$(basename "$REPO_PATH")
USER_NAME=$(git config user.name)
DATE=$(date "+%Y-%m-%d %H:%M:%S")

# Banner
show_banner() {
  clear
  echo -e "${BOLD}${BLUE}"
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║                TASK11 UTVECKLINGSKONSOL                    ║"
  echo "╚════════════════════════════════════════════════════════════╝${RESET}"
  echo -e "${BOLD}${CYAN}Användare:${RESET} $USER_NAME"
  echo -e "${BOLD}${CYAN}Projekt:${RESET} $REPO_NAME"
  echo -e "${BOLD}${CYAN}Branch:${RESET} $BRANCH | ${BOLD}${CYAN}Commit:${RESET} $CURRENT_COMMIT"
  echo -e "${BOLD}${CYAN}Datum:${RESET} $DATE"
  echo -e "${BOLD}${CYAN}──────────────────────────────────────────────────────────────${RESET}\n"
}

# Huvudmeny
show_menu() {
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
}

# Execute chosen action
run_action() {
  case $1 in
    1) 
      ./check_pipeline.sh
      ;;
    2) 
      ./check_pipeline.sh --mock
      ;;
    3) 
      echo "Öppnar pipeline i webbläsaren..."
      open "https://github.com/cstarendal/task11/actions"
      ;;
    4) 
      echo -e "\n${BOLD}${CYAN}Kör tester...${RESET}\n"
      npm test
      ;;
    5) 
      echo -e "\n${BOLD}${CYAN}Kör linting...${RESET}\n"
      npm run lint
      ;;
    6) 
      echo -e "\n${BOLD}${CYAN}Bygger alla paket...${RESET}\n"
      npm run build
      ;;
    7) 
      show_project_overview
      ;;
    8) 
      show_tdd_guide
      ;;
    9) 
      echo -e "\n${BOLD}${CYAN}Installerar VS Code Pipeline Extension...${RESET}\n"
      cd tools/pipeline-status-extension && ./package-extension.sh
      cd "$REPO_PATH"
      ;;
    [pP]) 
      show_pipeline_history
      ;;
    [vV])
      ./pipeline-visualize.sh
      ;;
    [dD]) 
      debug_pipeline_api
      ;;
    0) 
      echo -e "\n${BOLD}${CYAN}Avslutar...${RESET}\n"
      exit 0
      ;;
    *) 
      echo -e "\n${BOLD}${RED}Ogiltigt val. Försök igen.${RESET}\n"
      ;;
  esac
}

# Show project overview
show_project_overview() {
  echo -e "\n${BOLD}${BLUE}╭── PROJEKTÖVERSIKT ───────────────────────────────────────╮${RESET}"
  
  # Antal filer per språk
  echo -e "\n${BOLD}${CYAN}Kodbas:${RESET}"
  echo -e "  TypeScript: $(find . -name "*.ts" | grep -v "node_modules" | wc -l | tr -d '[:space:]') filer"
  echo -e "  JavaScript: $(find . -name "*.js" | grep -v "node_modules" | wc -l | tr -d '[:space:]') filer"
  echo -e "  JSON:       $(find . -name "*.json" | grep -v "node_modules" | wc -l | tr -d '[:space:]') filer"
  
  # Paket status
  echo -e "\n${BOLD}${CYAN}Paket:${RESET}"
  echo -e "  Domain:         $(ls -la packages/domain/src | grep -v '^d' | grep -v 'total' | wc -l | tr -d '[:space:]') filer"
  echo -e "  Application:    $(ls -la packages/application/src | grep -v '^d' | grep -v 'total' | wc -l | tr -d '[:space:]') filer"
  echo -e "  Infrastructure: $(ls -la packages/infrastructure/src | grep -v '^d' | grep -v 'total' | wc -l | tr -d '[:space:]') filer"
  echo -e "  Shared:         $(ls -la packages/shared/src | grep -v '^d' | grep -v 'total' | wc -l | tr -d '[:space:]') filer"
  
  # Test status
  echo -e "\n${BOLD}${CYAN}Test:${RESET}"
  TEST_COUNT=$(find . -name "*.test.ts" | grep -v "node_modules" | wc -l | tr -d '[:space:]')
  echo -e "  Test filer: $TEST_COUNT"
  
  # Git status
  echo -e "\n${BOLD}${CYAN}Git:${RESET}"
  COMMIT_COUNT=$(git rev-list --count HEAD)
  echo -e "  Antal commits: $COMMIT_COUNT"
  
  echo -e "\n${BOLD}${BLUE}╰──────────────────────────────────────────────────────────╯${RESET}\n"
}

# Show TDD guide
show_tdd_guide() {
  echo -e "\n${BOLD}${BLUE}╭── TDD ARBETSFLÖDE ─────────────────────────────────────╮${RESET}"
  echo -e "\n${BOLD}${RED}1. RED${RESET} - Skriv ett misslyckande test"
  echo -e "   git add . && git commit -m \"test: RED - [testbeskrivning]\"\n"
  echo -e "${BOLD}${GREEN}2. GREEN${RESET} - Implementera minimal kod för att klara testet"
  echo -e "   git add . && git commit -m \"feat: GREEN - [implementationsbeskrivning]\"\n"
  echo -e "${BOLD}${BLUE}3. REFACTOR${RESET} - Förbättra koden med bibehållen funktionalitet"
  echo -e "   git add . && git commit -m \"refactor: REFACTOR - [refaktoreringsbeskrivning]\"\n"
  echo -e "${BOLD}${YELLOW}4. Kontrollera pipeline${RESET} innan nästa TDD-cykel"
  echo -e "   ./check_pipeline.sh\n"
  echo -e "${BOLD}${MAGENTA}📋 TÄNK PÅ:${RESET}"
  echo -e " • Inga implementationer utan test först"
  echo -e " • Ett test, en implementation, en refaktor per gång"
  echo -e " • Alltid mindre än 5 minuter mellan commits"
  echo -e " • Kontrollera alltid att pipeline är grön innan nästa cykel"
  echo -e "\n${BOLD}${BLUE}╰─────────────────────────────────────────────────────────╯${RESET}\n"
}

# Main function
# Function to show pipeline history
show_pipeline_history() {
  echo -e "\n${BOLD}${BLUE}╭── PIPELINE KÖRNINGSHISTORIK ───────────────────────────────╮${RESET}"
  echo -e "\n${BOLD}${CYAN}Hämtar de senaste 10 pipeline-körningarna...${RESET}\n"
  
  # Save the token as environment variable if it exists
  if [ -f "${HOME}/.github_token" ]; then
    export GITHUB_TOKEN="$(cat ${HOME}/.github_token)"
  fi

  # Get the repository from the git remote, or use default
  REMOTE_URL=$(git config --get remote.origin.url || echo "cstarendal/task11")
  REPO_NAME=$(echo $REMOTE_URL | sed -E 's|.*github.com[:/]([^/]+/[^/.]+).*|\1|')
  
  # Use curl to fetch the workflow runs
  if [ -n "$GITHUB_TOKEN" ]; then
    curl_auth="-H \"Authorization: token $GITHUB_TOKEN\""
  else
    curl_auth=""
  fi
  
  echo -e "${YELLOW}Ansluter till GitHub API...${RESET}"
  
  # Use node for better JSON handling
  node -e "
    const https = require('https');
    
    const options = {
      hostname: 'api.github.com',
      path: '/repos/${REPO_NAME}/actions/runs?per_page=10',
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js Pipeline Status Checker'${GITHUB_TOKEN:+,
        'Authorization': 'token $GITHUB_TOKEN'}
      }
    };
    
    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.workflow_runs && result.workflow_runs.length > 0) {
            console.log('\n\x1b[1m\x1b[36m%-6s %-10s %-12s %-8s %-20s %-20s\x1b[0m', 
              'NR', 'STATUS', 'RESULTAT', 'BRANCH', 'COMMIT', 'DATUM');
            console.log('\x1b[36m%s\x1b[0m', '─'.repeat(80));
            
            result.workflow_runs.forEach((run, index) => {
              const date = new Date(run.created_at).toLocaleString();
              const shortSha = run.head_sha.substring(0, 7);
              
              // Colors based on status
              let statusColor = '\x1b[33m'; // Yellow (default)
              if (run.status === 'completed') {
                statusColor = run.conclusion === 'success' ? '\x1b[32m' : '\x1b[31m';
              } else if (run.status === 'in_progress') {
                statusColor = '\x1b[34m';
              }
              
              console.log(
                '%s%-6d %s%-10s\x1b[0m %s%-12s\x1b[0m %-8s %-20s %-20s', 
                '\x1b[1m', (index + 1),
                statusColor, run.status,
                statusColor, (run.conclusion || 'pending'),
                run.head_branch, 
                shortSha,
                date
              );
            });
            
            console.log('\\n\x1b[36m%s\x1b[0m', '─'.repeat(80));
            console.log('\nFör att se detaljer: \x1b[1m%s\x1b[0m\\n', 
              'https://github.com/${REPO_NAME}/actions');
          } else {
            console.log('\x1b[31mInga pipeline-körningar hittades.\x1b[0m');
          }
        } catch (error) {
          console.error('\x1b[31mFel vid parsning av svar: ' + error.message + '\x1b[0m');
        }
      });
    }).on('error', (e) => {
      console.error('\x1b[31mFel vid anslutning till GitHub API: ' + e.message + '\x1b[0m');
    });
  "
  
  echo -e "\n${BOLD}${BLUE}╰──────────────────────────────────────────────────────────╯${RESET}\n"
}

# Function to debug pipeline API
debug_pipeline_api() {
  echo -e "\n${BOLD}${BLUE}╭── PIPELINE API DEBUG ─────────────────────────────────────╮${RESET}"
  echo -e "\n${BOLD}${CYAN}Hämtar rådata från GitHub API för felsökning...${RESET}\n"
  
  # Save the token as environment variable if it exists
  if [ -f "${HOME}/.github_token" ]; then
    export GITHUB_TOKEN="$(cat ${HOME}/.github_token)"
  fi
  
  # Get the repository from the git remote, or use default
  REMOTE_URL=$(git config --get remote.origin.url || echo "cstarendal/task11")
  REPO_NAME=$(echo $REMOTE_URL | sed -E 's|.*github.com[:/]([^/]+/[^/.]+).*|\1|')
  
  echo -e "${YELLOW}Repo: ${REPO_NAME}${RESET}"
  echo -e "${YELLOW}Ansluter till GitHub API...${RESET}\n"
  
  # Use node for better JSON handling and response debugging
  node -e "
    const https = require('https');
    
    const options = {
      hostname: 'api.github.com',
      path: '/repos/${REPO_NAME}/actions/runs?per_page=3',
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js Pipeline Debug Tool'${GITHUB_TOKEN:+,
        'Authorization': 'token $GITHUB_TOKEN'}
      }
    };
    
    console.log('\x1b[33mAPIförfrågan: https://api.github.com/repos/${REPO_NAME}/actions/runs?per_page=3\x1b[0m');
    
    https.get(options, (res) => {
      console.log('\x1b[36m%s\x1b[0m', '─'.repeat(80));
      console.log('\x1b[1m\x1b[36mHTTP Svarskod:\x1b[0m', res.statusCode);
      console.log('\x1b[1m\x1b[36mHTTP Headers:\x1b[0m');
      console.log(JSON.stringify(res.headers, null, 2));
      console.log('\x1b[36m%s\x1b[0m', '─'.repeat(80));
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('\x1b[1m\x1b[36mAPI Svarsinnehåll:\x1b[0m');
          console.log(JSON.stringify(result, null, 2));
          
          // Om vi har körningar, hämta detaljer för första körningen
          if (result.workflow_runs && result.workflow_runs.length > 0) {
            const firstRun = result.workflow_runs[0];
            console.log('\x1b[36m%s\x1b[0m', '─'.repeat(80));
            console.log('\x1b[1m\x1b[36mDetaljer för senaste körning (ID: ' + firstRun.id + '):\x1b[0m');
            
            // Hämta jobben för denna körning
            const jobsOptions = {
              hostname: 'api.github.com',
              path: '/repos/${REPO_NAME}/actions/runs/' + firstRun.id + '/jobs',
              method: 'GET',
              headers: options.headers
            };
            
            console.log('\x1b[33mHämtar jobb för körning ' + firstRun.id + '...\x1b[0m');
            
            https.get(jobsOptions, (jobsRes) => {
              let jobsData = '';
              jobsRes.on('data', (chunk) => { jobsData += chunk; });
              jobsRes.on('end', () => {
                try {
                  const jobsResult = JSON.parse(jobsData);
                  console.log('\x1b[1m\x1b[36mJobb för körning:\x1b[0m');
                  console.log(JSON.stringify(jobsResult, null, 2));
                } catch (error) {
                  console.error('\x1b[31mFel vid parsning av jobb-svar: ' + error.message + '\x1b[0m');
                }
              });
            });
          }
          
        } catch (error) {
          console.error('\x1b[31mFel vid parsning av svar: ' + error.message + '\x1b[0m');
          console.error('\x1b[31mRådata: ' + data + '\x1b[0m');
        }
      });
    }).on('error', (e) => {
      console.error('\x1b[31mFel vid anslutning till GitHub API: ' + e.message + '\x1b[0m');
    });
  "
  
  echo -e "\n${BOLD}${BLUE}╰──────────────────────────────────────────────────────────╯${RESET}\n"
}

main() {
  show_banner
  
  if [ $# -eq 0 ]; then
    show_menu
    read -p "Välj ett alternativ (0-9, P, V, D): " choice
    run_action $choice
    
    # Vänta på användarinput innan menyn visas igen
    echo -e "\nTryck på ENTER för att fortsätta..."
    read
    
    # Rekursivt anropa main för att visa menyn igen
    main
  else
    # Hantera direktkommandon
    case $1 in
      "pipeline") 
        ./check_pipeline.sh
        ;;
      "mock") 
        ./check_pipeline.sh --mock
        ;;
      "pipeline-jobs") 
        ./check_pipeline.sh --jobs
        ;;
      "pipeline-steps") 
        ./check_pipeline.sh --jobs --steps
        ;;
      "pipeline-debug") 
        ./check_pipeline.sh --debug
        ;;
      "pipeline-history") 
        show_pipeline_history
        ;;
      "debug-api") 
        debug_pipeline_api
        ;;
      "test") 
        npm test
        ;;
      "lint") 
        npm run lint
        ;;
      "build") 
        npm run build
        ;;
      "tdd") 
        show_tdd_guide
        ;;
      "pipeline-visual") 
        ./pipeline-visualize.sh
        ;;
      "pipeline-visual-all") 
        ./pipeline-visualize.sh --all
        ;;
      *) 
        echo -e "${BOLD}${RED}Ogiltigt kommando: $1${RESET}"
        echo -e "Tillgängliga kommandon: pipeline, mock, pipeline-jobs, pipeline-steps, pipeline-debug, pipeline-history, pipeline-visual, pipeline-visual-all, debug-api, test, lint, build, tdd"
        exit 1
        ;;
    esac
  fi
}

# Run main function
main "$@"
