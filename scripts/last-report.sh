#!/usr/bin/env bash
set -e
REPORT_DIR="./logs/diagnostics"
if [ ! -d "$REPORT_DIR" ]; then
  echo "No diagnostics reports found."
  exit 0
fi
LAST=$(ls -t "$REPORT_DIR"/diagnose-report-*.txt 2>/dev/null | head -n 1 || true)
if [ -z "$LAST" ]; then
  echo "No diagnose reports found."
  exit 0
fi
echo "Showing $LAST"
echo "--------------------------------"
cat "$LAST"
