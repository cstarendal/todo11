#!/usr/bin/env node
// filepath: /Users/cstarendal/Resilio Sync/Code/TODO 11/tools/pipeline-visualizer.js
const https = require('https');
const { execSync } = require('child_process');

// Konfiguration
const REPO = process.env.GITHUB_REPO || 'cstarendal/task11';
const PERSONAL_ACCESS_TOKEN = process.env.GITHUB_TOKEN || '';
const RUNS_TO_SHOW = process.argv.includes('--all') ? 20 : 10;

// Stilar för output
const STYLES = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Textfärger
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Bakgrundsfärger
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

// Funktion för att göra en HTTP-förfrågan
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Node.js Pipeline Visualizer',
      }
    };
    
    if (PERSONAL_ACCESS_TOKEN) {
      options.headers['Authorization'] = `token ${PERSONAL_ACCESS_TOKEN}`;
    }

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(`Error parsing response: ${error.message}`);
          }
        } else {
          reject(`HTTP Error: ${res.statusCode}`);
        }
      });
    }).on('error', (error) => reject(`Request error: ${error.message}`));
  });
}

// Visualisera workflowkörningar över tid
async function visualizePipelineHistory() {
  try {
    console.log(`\n${STYLES.bold}${STYLES.cyan}Hämtar pipeline-historik från GitHub...${STYLES.reset}\n`);
    
    const apiUrl = `https://api.github.com/repos/${REPO}/actions/runs?per_page=${RUNS_TO_SHOW}`;
    const response = await makeRequest(apiUrl);
    
    if (response.workflow_runs && response.workflow_runs.length > 0) {
      // Sortera körningar efter datum
      const runs = response.workflow_runs.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      );
      
      // Skapa en visuell tidslinje
      console.log(`${STYLES.bold}╔══════════════════ Pipeline Historik ══════════════════╗${STYLES.reset}`);
      
      // Visa tidslinjeförklaring
      console.log(`${STYLES.bold}║ Symbolförklaring:                                     ║${STYLES.reset}`);
      console.log(`${STYLES.bold}║${STYLES.reset} ${STYLES.green}●${STYLES.reset} Lyckad  ${STYLES.red}●${STYLES.reset} Misslyckad  ${STYLES.blue}●${STYLES.reset} Pågående  ${STYLES.yellow}●${STYLES.reset} Avbruten       ${STYLES.bold}║${STYLES.reset}`);
      console.log(`${STYLES.bold}╠══════════════════════════════════════════════════════╣${STYLES.reset}`);
      
      // Hitta aktuell commit
      const currentCommitSha = execSync('git rev-parse HEAD').toString().trim();
      
      runs.forEach((run, index) => {
        // Formatera datum
        const date = new Date(run.created_at).toLocaleString();
        const shortSha = run.head_sha.substring(0, 7);
        const isCurrentCommit = run.head_sha === currentCommitSha;
        
        // Välj färg baserat på status/resultat
        let statusSymbol, statusColor;
        if (run.status === 'completed') {
          if (run.conclusion === 'success') {
            statusSymbol = '●';
            statusColor = STYLES.green;
          } else if (run.conclusion === 'failure') {
            statusSymbol = '●';
            statusColor = STYLES.red;
          } else if (run.conclusion === 'cancelled') {
            statusSymbol = '●';
            statusColor = STYLES.yellow;
          } else {
            statusSymbol = '◌';
            statusColor = STYLES.white;
          }
        } else if (run.status === 'in_progress') {
          statusSymbol = '●';
          statusColor = STYLES.blue;
        } else {
          statusSymbol = '◌';
          statusColor = STYLES.white;
        }
        
        // Visa commit-namn med markering om det är aktuell commit
        const commitDisplay = isCurrentCommit ? 
          `${shortSha} ${STYLES.bold}${STYLES.green}(aktuell)${STYLES.reset}` : 
          shortSha;
        
        // Visuell representation
        console.log(`${STYLES.bold}║${STYLES.reset} ${statusColor}${statusSymbol}${STYLES.reset} ${date} - ${commitDisplay}`);
        
        // Lägg till en länk för detaljer
        const detailsLink = run.html_url;
        console.log(`${STYLES.bold}║${STYLES.reset}   ${STYLES.dim}${run.name}${STYLES.reset}`);
        
        // Lägg till detaljer för körningen om tillgängliga
        if (run.conclusion) {
          console.log(`${STYLES.bold}║${STYLES.reset}   Status: ${getStatusWithColor(run.status)}, Result: ${getResultWithColor(run.conclusion)}`);
        } else {
          console.log(`${STYLES.bold}║${STYLES.reset}   Status: ${getStatusWithColor(run.status)}`);
        }
        
        // Om det inte är sista körningen, lägg till en kopplande linje
        if (index < runs.length - 1) {
          console.log(`${STYLES.bold}║${STYLES.reset}   │`);
        }
      });
      
      console.log(`${STYLES.bold}╚══════════════════════════════════════════════════════╝${STYLES.reset}`);
      console.log(`\nFör detaljer: ${STYLES.cyan}https://github.com/${REPO}/actions${STYLES.reset}\n`);
    } else {
      console.log(`${STYLES.red}Inga workflow-körningar hittades.${STYLES.reset}`);
    }
  } catch (error) {
    console.error(`${STYLES.red}Fel vid hämtning av pipeline-historik: ${error}${STYLES.reset}`);
  }
}

// Hjälpfunktioner för formatering
function getStatusWithColor(status) {
  switch(status) {
    case 'completed': return `${STYLES.green}Completed${STYLES.reset}`;
    case 'in_progress': return `${STYLES.blue}In Progress${STYLES.reset}`;
    case 'queued': return `${STYLES.cyan}Queued${STYLES.reset}`;
    default: return `${STYLES.yellow}${status}${STYLES.reset}`;
  }
}

function getResultWithColor(conclusion) {
  if (!conclusion) return `${STYLES.yellow}Pending${STYLES.reset}`;
  
  switch(conclusion) {
    case 'success': return `${STYLES.green}Success✓${STYLES.reset}`;
    case 'failure': return `${STYLES.red}Failed✗${STYLES.reset}`;
    case 'cancelled': return `${STYLES.yellow}Cancelled${STYLES.reset}`;
    case 'skipped': return `${STYLES.cyan}Skipped${STYLES.reset}`;
    default: return `${STYLES.yellow}${conclusion}${STYLES.reset}`;
  }
}

// Kör visualiseringen
visualizePipelineHistory();
