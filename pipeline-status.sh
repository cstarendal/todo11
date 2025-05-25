#!/bin/bash
# filepath: /Users/cstarendal/Resilio Sync/Code/TASK 11/pipeline-status.sh

# Enkel pipeline-statusmonitor som uppdateras automatiskt
# Användning: ./pipeline-status.sh [--mock]

# Kontrollera om --mock flaggan är angiven
if [ "$1" == "--mock" ]; then
  USE_MOCK="--mock"
else
  USE_MOCK=""
fi

# Funktioner för att visa aktuell status
show_status() {
  clear
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║                 PIPELINE STATUS MONITOR                    ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo "  Uppdateras var 10:e sekund. Tryck Ctrl+C för att avsluta."
  echo ""
  ./check_pipeline.sh $USE_MOCK
}

# Loop som uppdaterar status var 10:e sekund
while true; do
  show_status
  sleep 10
done
