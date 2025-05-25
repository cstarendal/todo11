# Pipeline Monitoring System Documentation

## Overview

The Todo11 Pipeline Monitoring System is designed to provide comprehensive visibility into the CI/CD pipeline status for the project, ensuring that the team can follow the TDD cycle (Red-Green-Refactor) with confidence. This document explains how all the components work together.

## Components

### 1. Core Pipeline Status Checker (`check-pipeline.js`)

The foundation of the monitoring system is `scripts/check-pipeline.js`, which:

- Connects to GitHub API to fetch workflow run status
- Determines if the current commit has passed CI/CD
- Shows detailed status information including status, conclusion, and timestamps
- Can display detailed job and step information with `--jobs` and `--steps` flags
- Provides debugging output with `--debug` flag
- Has a mock mode (`--mock`) for testing without API calls
- Saves status information to `.pipeline-status.json` for other tools to use

### 2. Shell Wrapper (`check_pipeline.sh`)

This bash wrapper:
- Provides a user-friendly interface to `check-pipeline.js`
- Passes through command-line arguments
- Shows a helpful TDD cycle reminder when the pipeline is green
- Handles both real and mock modes

### 3. Continuous Monitoring (`pipeline-status.sh`)

A continuous monitoring tool that:
- Runs `check_pipeline.sh` every 10 seconds
- Provides real-time updates on pipeline status
- Works in both real and mock modes

### 4. Pipeline Visualization (`pipeline-visualizer.js`)

A visualization tool that:
- Shows a historical timeline of pipeline runs
- Provides visual indicators for success, failure, and in-progress runs
- Shows detailed information about each run
- Highlights the current commit's pipeline status

### 5. Development Console (`dev.sh`)

A central hub for development tasks:
- Provides quick access to all pipeline checking tools
- Includes pipeline history and visualization options
- Offers debug mode for API inspection
- Includes TDD workflow guide and project overview

### 6. VS Code Integration

#### VS Code Tasks
Pre-configured tasks for:
- Checking pipeline status (real and mock)
- Visualizing pipeline history
- Showing detailed job information
- Opening pipeline in browser

#### VS Code Extension (`tools/pipeline-status-extension`)
A custom extension that:
- Shows pipeline status in the VS Code status bar
- Updates automatically every 30 seconds
- Provides color coding for pipeline status
- Allows clicking to open pipeline in browser

### 7. Repo Update Tool (`update-repo-name.sh`)

A utility script to:
- Update the repository name in all configuration files
- Ensure the system works with any forked or renamed repository
- Provide feedback on updated files

## Workflows

### Basic TDD Workflow

1. Write a failing test (RED)
   ```bash
   git commit -m "test: RED - [test description]"
   ```

2. Implement minimal code to pass (GREEN)
   ```bash
   git commit -m "feat: GREEN - [implementation description]"
   ```

3. Refactor while maintaining functionality (REFACTOR)
   ```bash
   git commit -m "refactor: REFACTOR - [refactoring description]"
   ```

4. Check pipeline status to ensure everything is working
   ```bash
   ./check_pipeline.sh
   ```

5. Start next TDD cycle only when pipeline is green

### Advanced Pipeline Inspection

For deeper insights into pipeline issues:

1. Check detailed job information:
   ```bash
   ./check_pipeline.sh --jobs
   ```

2. Investigate step-by-step execution:
   ```bash
   ./check_pipeline.sh --jobs --steps
   ```

3. Debug API responses:
   ```bash
   ./check_pipeline.sh --debug
   ```

4. View pipeline history:
   ```bash
   ./dev.sh pipeline-history
   ```

5. Visualize pipeline over time:
   ```bash
   ./pipeline-visualize.sh
   ```

## Configuration

### Using with Private Repositories

For private repositories, set a GitHub Personal Access Token:

```bash
export GITHUB_TOKEN="your-personal-access-token"
```

For persistent configuration, add to your `~/.zshrc` or `~/.bash_profile`.

### Changing Repository Name

To update the repository name in all files:

```bash
./update-repo-name.sh "username/repository"
```

## Technical Implementation Details

1. **GitHub API Integration**: Uses the GitHub REST API to fetch workflow run statuses
2. **Status Persistence**: Saves status to `.pipeline-status.json` for other tools to read
3. **VS Code Extension**: Custom extension that reads saved status data and updates the status bar
4. **Terminal UI**: Uses ANSI escape codes for colorized terminal output
5. **Mock Mode**: Simulated data for testing and demonstrations without API calls

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Ensure `GITHUB_TOKEN` is set correctly for private repositories
   - Check that token has proper permissions (workflow:read)

2. **Repository Not Found**
   - Verify repository name is correct
   - Run `./update-repo-name.sh` with the correct repository name

3. **Rate Limiting**
   - Use authenticated requests with GITHUB_TOKEN to increase rate limits
   - Reduce frequency of checks if hitting limits

### Debugging Tips

1. Use `./check_pipeline.sh --debug` to see raw API responses
2. Check `.pipeline-status.json` for latest saved status
3. Run `./dev.sh debug-api` for detailed API diagnostics
