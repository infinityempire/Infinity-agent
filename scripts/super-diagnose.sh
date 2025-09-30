#!/usr/bin/env bash
set -e
APP_URL_LOCAL=${APP_URL_LOCAL:-"http://localhost:3000/api/ask"}
APP_URL_PROD=${APP_URL_PROD:-"${APP_URL_PROD:-}"}
REPORT_DIR="./logs/diagnostics"
mkdir -p "$REPORT_DIR"
REPORT_FILE="$REPORT_DIR/super-diagnose-$(date +%Y%m%d-%H%M%S).txt"
exec > >(tee -i "$REPORT_FILE") 2>&1
echo "=== SUPER DIAGNOSE ==="
echo "Local build check..."
if npm run build >/dev/null 2>&1; then echo "✅ build ok"; else echo "❌ build failed"; fi
echo "Local server probe (port 3000)..."
if command -v lsof >/dev/null 2>&1 && lsof -i :3000 >/dev/null 2>&1; then echo "✅ local server running"; else echo "⚠️ no local server detected"; fi
echo "Local E2E..."
if command -v curl >/dev/null 2>&1 && command -v jq >/dev/null 2>&1; then
  RESP=$(curl -s -X POST "$APP_URL_LOCAL" -H "Content-Type: application/json" -d '{"question":"ping"}' | jq -r '.answer // empty')
  if [ -z "$RESP" ]; then echo "❌ local E2E failed"; else echo "✅ local E2E: $RESP"; fi
else
  echo "⚠️ curl or jq missing"
fi
if [ -n "$APP_URL_PROD" ]; then
  echo "Production E2E to $APP_URL_PROD"
  if command -v curl >/dev/null 2>&1 && command -v jq >/dev/null 2>&1; then
    RESP_P=$(curl -s -X POST "$APP_URL_PROD" -H "Content-Type: application/json" -d '{"question":"ping from super-diagnose"}' | jq -r '.answer // empty')
    if [ -z "$RESP_P" ]; then echo "❌ production E2E failed"; else echo "✅ production E2E: $RESP_P"; fi
  else
    echo "⚠️ curl or jq missing for production check"
  fi
else
  echo "⚠️ APP_URL_PROD not set — skipping production checks"
fi
echo "Report saved to: $REPORT_FILE"
