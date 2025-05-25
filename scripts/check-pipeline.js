#!/usr/bin/env node

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Konfiguration
const REPO = process.env.GITHUB_REPO || 'cstarendal/todo11'; // Kan överskrivas med miljövariabel
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const STATUS_FILE = path.join(__dirname, '..', '.pipeline-status.json');
const PERSONAL_ACCESS_TOKEN = process.env.GITHUB_TOKEN || '';  // GitHub Personal Access Token för privata repos

// Kontrollera om JSON-output begärts
const isJsonOutput = process.argv.includes('--json');

// Stilar för output
const STYLES = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

// Hämta senaste commit SHA
const commitSha = execSync('git rev-parse HEAD').toString().trim();
console.log(`${STYLES.bold}${STYLES.blue}🔍 Checking pipeline status for commit:${STYLES.reset} ${commitSha}\n`);

// Funktion för att göra en HTTP-förfrågan
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Node.js Pipeline Status Checker',
      }
    };
    
    // Om vi har en access token, lägg till den för autentisering
    if (PERSONAL_ACCESS_TOKEN) {
      options.headers['Authorization'] = `token ${PERSONAL_ACCESS_TOKEN}`;
    }

    // Logga URL om vi är i debug-läge
    const isDebug = process.argv.includes('--debug');
    if (isDebug) {
      console.log(`${STYLES.cyan}Making request to: ${url}${STYLES.reset}`);
    }

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            
            // Om vi är i debug-läge, logga API-svaret
            if (isDebug) {
              console.log(`${STYLES.yellow}Response headers:${STYLES.reset}`);
              console.log(JSON.stringify(res.headers, null, 2));
              console.log(`${STYLES.yellow}Response:${STYLES.reset}`);
              console.log(JSON.stringify(jsonData, null, 2));
            }
            
            resolve(jsonData);
          } catch (error) {
            reject(`Error parsing response: ${error.message}`);
          }
        } else if (res.statusCode === 404) {
          reject(`HTTP Error 404: Repository inte hittat eller API-URL felaktig. 
          \nKontrollera att repot "${REPO}" existerar och är publikt, 
          \neller använd en GITHUB_TOKEN miljövariabel för privata repos.`);
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          reject(`HTTP Error ${res.statusCode}: Autentiseringsfel. 
          \nSätt GITHUB_TOKEN miljövariabeln med en giltig personal access token.`);
        } else {
          reject(`HTTP Error: ${res.statusCode}`);
        }
      });
    }).on('error', (error) => reject(`Request error: ${error.message}`));
  });
}

// Skapa en mock-status för testning om det behövs
function createMockStatus() {
  return {
    status: 'completed',
    conclusion: 'success',
    url: `https://github.com/${REPO}/actions`,
    updated: new Date().toLocaleString(),
    commit: commitSha,
    isCurrentCommit: true,
    timestamp: Date.now(),
    isMock: true
  };
}

// Spara status till fil för VS Code extension
function saveStatus(status) {
  try {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
    console.log(`${STYLES.cyan}Status sparad till ${STATUS_FILE}${STYLES.reset}`);
  } catch (error) {
    console.error(`${STYLES.red}Could not save status file: ${error.message}${STYLES.reset}`);
  }
}

// Kontrollera workflow-körningar
async function checkPipelineStatus() {
  try {
    console.log(`${STYLES.cyan}Fetching workflow runs from GitHub API...${STYLES.reset}`);
    const apiUrl = `https://api.github.com/repos/${REPO}/actions/runs?branch=${BRANCH}&per_page=5`;
    
    // För utvecklingsläge kan vi lägga till en flag för att använda mock-data
    const useMockData = process.argv.includes('--mock') || process.env.USE_MOCK_DATA === 'true';
    
    if (useMockData) {
      console.log(`${STYLES.yellow}Använder mock-data för pipeline-status${STYLES.reset}`);
      const mockStatus = createMockStatus();
      saveStatus(mockStatus);
      
      console.log(`\n${STYLES.bold}━━━━━━━━━ Pipeline Status (MOCK) ━━━━━━━━━${STYLES.reset}`);
      console.log(`${STYLES.bold}Status:${STYLES.reset} ${getStatusWithColor('completed')}`);
      console.log(`${STYLES.bold}Result:${STYLES.reset} ${getResultWithColor('success')}`);
      console.log(`${STYLES.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${STYLES.reset}\n`);
      
      console.log(`${STYLES.bold}${STYLES.green}✅ (MOCK) Pipeline GRÖN - Säkert att fortsätta med nästa TDD-cykel!${STYLES.reset}`);
      process.exit(0);
      return;
    }
    
    const response = await makeRequest(apiUrl);

    if (response.workflow_runs && response.workflow_runs.length > 0) {
      // Hitta den senaste körningen för den specifika committen
      const commitRun = response.workflow_runs.find(run => run.head_sha === commitSha);
      const latestRun = response.workflow_runs[0];
      
      // Använd den senaste körningen om vi inte hittar en för den specifika committen
      const run = commitRun || latestRun;
      const { status, conclusion, html_url, updated_at, head_sha, name } = run;
      
      const isForCurrentCommit = head_sha === commitSha;
      
      // Formaterad tidangivelse
      const updatedDate = new Date(updated_at);
      const formattedDate = updatedDate.toLocaleString();
      
      console.log(`\n${STYLES.bold}━━━━━━━━━ Pipeline Status ━━━━━━━━━${STYLES.reset}`);
      console.log(`${STYLES.bold}Workflow:${STYLES.reset} ${name}`);
      console.log(`${STYLES.bold}Status:${STYLES.reset} ${getStatusWithColor(status)}`);
      console.log(`${STYLES.bold}Result:${STYLES.reset} ${getResultWithColor(conclusion)}`);
      console.log(`${STYLES.bold}Commit:${STYLES.reset} ${head_sha.substring(0, 7)} ${isForCurrentCommit ? `${STYLES.green}(current)${STYLES.reset}` : `${STYLES.yellow}(not current)${STYLES.reset}`}`);
      console.log(`${STYLES.bold}Updated:${STYLES.reset} ${formattedDate}`);
      console.log(`${STYLES.bold}Details:${STYLES.reset} ${html_url}`);
      
      // Om vi vill visa detaljinformation om jobben
      const showJobDetails = process.argv.includes('--jobs') || process.argv.includes('--details');
      
      if (showJobDetails) {
        try {
          console.log(`\n${STYLES.bold}${STYLES.cyan}Hämtar jobbinformation...${STYLES.reset}`);
          const jobsUrl = `https://api.github.com/repos/${REPO}/actions/runs/${run.id}/jobs`;
          const jobsData = await makeRequest(jobsUrl);
          
          if (jobsData.jobs && jobsData.jobs.length > 0) {
            console.log(`\n${STYLES.bold}━━━━━━━━━ Job Details ━━━━━━━━━${STYLES.reset}`);
            console.log(`${STYLES.bold}${STYLES.cyan}%-3s %-22s %-12s %-12s %-10s${STYLES.reset}`, 
                        "Nr", "Namn", "Status", "Resultat", "Tid (s)");
            console.log(`${STYLES.cyan}${"─".repeat(60)}${STYLES.reset}`);
            
            jobsData.jobs.forEach((job, index) => {
              const duration = job.completed_at && job.started_at ? 
                  Math.round((new Date(job.completed_at) - new Date(job.started_at)) / 1000) : 
                  "-";
              
              console.log(`${STYLES.bold}%-3d${STYLES.reset} %-22s %s %-10s %s`,
                          index + 1,
                          job.name.substring(0, 22),
                          getStatusWithColor(job.status),
                          getResultWithColor(job.conclusion),
                          duration);
                          
              // Om vi vill visa steg för varje jobb
              if (process.argv.includes('--steps') && job.steps) {
                console.log(`   ${STYLES.cyan}${"─".repeat(56)}${STYLES.reset}`);
                job.steps.forEach((step, stepIndex) => {
                  const stepDuration = step.completed_at && step.started_at ? 
                      Math.round((new Date(step.completed_at) - new Date(step.started_at)) / 1000) : 
                      "-";
                  console.log(`   ${STYLES.bold}%-2d${STYLES.reset} %-20s %s %s %-5s`,
                              stepIndex + 1,
                              step.name.substring(0, 20),
                              getStatusWithColor(step.status),
                              getResultWithColor(step.conclusion),
                              stepDuration + "s");
                });
                console.log(`   ${STYLES.cyan}${"─".repeat(56)}${STYLES.reset}`);
              }
            });
          } else {
            console.log(`${STYLES.yellow}Inga jobb hittades för denna workflow-körning.${STYLES.reset}`);
          }
        } catch (error) {
          console.error(`${STYLES.red}Fel vid hämtning av jobbinformation: ${error}${STYLES.reset}`);
        }
      }
      
      console.log(`${STYLES.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${STYLES.reset}\n`);
      
      // Spara status för VS Code extension
      saveStatus({
        status,
        conclusion, 
        url: html_url,
        updated: formattedDate,
        commit: head_sha,
        isCurrentCommit: isForCurrentCommit,
        timestamp: Date.now()
      });

      if (status === 'completed' && conclusion === 'success') {
        if (isForCurrentCommit) {
          console.log(`${STYLES.bold}${STYLES.green}✅ Pipeline GRÖN - Säkert att fortsätta med nästa TDD-cykel!${STYLES.reset}`);
          process.exit(0);
        } else {
          console.log(`${STYLES.bold}${STYLES.yellow}⚠️ Pipeline GRÖN men för en annan commit!${STYLES.reset}`);
          console.log(`${STYLES.yellow}Senaste körningen är för commit ${head_sha.substring(0, 7)}, men din aktuella commit är ${commitSha.substring(0, 7)}`);
          console.log(`${STYLES.yellow}Vänta tills GitHub Actions har triggats för din senaste commit.${STYLES.reset}`);
          process.exit(1);
        }
      } else if (status === 'in_progress') {
        console.log(`${STYLES.bold}${STYLES.blue}🔄 Pipeline körs fortfarande - Vänta tills den blir klar.${STYLES.reset}`);
        process.exit(1);
      } else if (status === 'queued') {
        console.log(`${STYLES.bold}${STYLES.cyan}⏳ Pipeline köar - Vänta tills den börjar köra.${STYLES.reset}`);
        process.exit(1);
      } else {
        console.log(`${STYLES.bold}${STYLES.red}❌ Pipeline MISSLYCKAD - Åtgärda felen innan du fortsätter.${STYLES.reset}`);
        console.log(`${STYLES.red}Se detaljerad information i GitHub Actions: ${html_url}${STYLES.reset}`);
        process.exit(1);
      }
    } else {
      console.log(`${STYLES.red}Inga workflow-körningar hittades.${STYLES.reset}`);
      process.exit(1);
    }
  } catch (error) {
    if (isJsonOutput) {
      console.log(JSON.stringify({ 
        error: error.message, 
        status: 'error', 
        success: false 
      }));
    } else {
      console.error(`${STYLES.red}Error checking pipeline status: ${error}${STYLES.reset}`);
    }
    process.exit(1);
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

// Kör funktionen
checkPipelineStatus();
