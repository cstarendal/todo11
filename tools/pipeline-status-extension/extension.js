const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

/**
 * @type {vscode.StatusBarItem}
 */
let statusBarItem;
let statusUpdateInterval;
const STATUS_FILE = '.pipeline-status.json';

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Task11 Pipeline Status extension is now active!');
    
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'task11-pipeline-status.openPipeline';
    statusBarItem.text = '$(sync~spin) Checking CI/CD...';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    
    // Register commands
    const checkStatusCmd = vscode.commands.registerCommand('task11-pipeline-status.checkStatus', runPipelineCheck);
    const openPipelineCmd = vscode.commands.registerCommand('task11-pipeline-status.openPipeline', openPipelineInBrowser);
    
    context.subscriptions.push(checkStatusCmd);
    context.subscriptions.push(openPipelineCmd);
    
    // Initial status check
    updateStatusBar();
    
    // Set up interval to check for updates (every 30 seconds)
    statusUpdateInterval = setInterval(updateStatusBar, 30000);
    context.subscriptions.push({ dispose: () => clearInterval(statusUpdateInterval) });
}

function deactivate() {
    if (statusUpdateInterval) {
        clearInterval(statusUpdateInterval);
    }
}

/**
 * Run the pipeline check script
 */
function runPipelineCheck() {
    const terminal = vscode.window.createTerminal('Pipeline Status');
    
    // Ge användaren val mellan verklig eller mock-check
    vscode.window.showQuickPick(['Real Pipeline Check', 'Mock Pipeline Check (for testing)'], {
        placeHolder: 'Select pipeline check mode'
    }).then(selected => {
        if (selected === 'Mock Pipeline Check (for testing)') {
            terminal.sendText('node scripts/check-pipeline.js --mock');
        } else if (selected === 'Real Pipeline Check') {
            terminal.sendText('node scripts/check-pipeline.js');
        }
        
        if (selected) {
            terminal.show();
        }
    });
}

/**
 * Open pipeline in browser
 */
async function openPipelineInBrowser() {
    const status = await readPipelineStatus();
    if (status && status.url) {
        vscode.env.openExternal(vscode.Uri.parse(status.url));
    } else {
        vscode.window.showInformationMessage('No pipeline URL available. Run a check first.');
    }
}

/**
 * Update the status bar item with current pipeline status
 */
async function updateStatusBar() {
    try {
        const status = await readPipelineStatus();
        
        if (!status) {
            statusBarItem.text = '$(circle-slash) No Pipeline Data';
            statusBarItem.tooltip = 'Run a pipeline check to get status';
            statusBarItem.backgroundColor = undefined;
            return;
        }
        
        // Check if status is older than 5 minutes
        const isStale = (Date.now() - status.timestamp) > 5 * 60 * 1000;
        
        if (isStale) {
            statusBarItem.text = '$(warning) Pipeline Status Stale';
            statusBarItem.tooltip = `Last checked: ${status.updated}\nClick to open in browser`;
            statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
            return;
        }
        
        switch (status.status) {
            case 'completed':
                if (status.conclusion === 'success') {
                    if (status.isMock) {
                        statusBarItem.text = '$(check) Pipeline: Success (Mock)';
                    } else {
                        statusBarItem.text = '$(check) Pipeline: Success';
                    }
                    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
                    
                    if (!status.isCurrentCommit) {
                        statusBarItem.text = '$(warning) Pipeline: Success (old commit)';
                        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
                    }
                } else {
                    statusBarItem.text = '$(error) Pipeline: Failed';
                    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
                }
                break;
                
            case 'in_progress':
                statusBarItem.text = '$(sync~spin) Pipeline: Running';
                statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
                break;
                
            case 'queued':
                statusBarItem.text = '$(clock) Pipeline: Queued';
                statusBarItem.backgroundColor = undefined;
                break;
                
            default:
                statusBarItem.text = `$(question) Pipeline: ${status.status}`;
                statusBarItem.backgroundColor = undefined;
        }
        
        statusBarItem.tooltip = `Status: ${status.status}\nResult: ${status.conclusion || 'Pending'}\nCommit: ${status.commit}\nUpdated: ${status.updated}\nClick to open in browser`;
    } catch (error) {
        console.error('Error updating status bar:', error);
        statusBarItem.text = '$(error) Pipeline: Error';
        statusBarItem.tooltip = `Error reading pipeline status: ${error.message}`;
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    }
}

/**
 * Read pipeline status from file
 * @returns {Promise<any>} The pipeline status
 */
async function readPipelineStatus() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return null;
    }
    
    const statusFilePath = path.join(workspaceFolders[0].uri.fsPath, STATUS_FILE);
    
    try {
        if (!fs.existsSync(statusFilePath)) {
            return null;
        }
        
        const data = fs.readFileSync(statusFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading status file:', error);
        return null;
    }
}

module.exports = {
    activate,
    deactivate
};
