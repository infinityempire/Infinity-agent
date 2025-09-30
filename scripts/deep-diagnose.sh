#!/usr/bin/env bash
set -e
APP_URL=${APP_URL:-"http://localhost:3000/api/ask"}
QUESTION="Diagnostic ping — are you alive?"
REPORT_DIR="./logs/diagnostics"
mkdir -p "$REPORT_DIR"
REPORT_FILE="$REPORT_DIR/diagnose-report-$(date +%Y%m%d-%H%M%S).txt"
exec > >(tee -i "$REPORT_FILE") 2>&1

echo "Checking environment variables..."
if [ -z "${VITE_HF_READ_TOKEN:-}" ]; then
  echo "❌ Missing Hugging Face token"
else
  echo "✅ Hugging Face token is set"
fi

echo "Checking if local server is running..."
if command -v lsof >/dev/null 2>&1 && lsof -i :3000 >/dev/null 2>&1; then
  echo "✅ Server is listening on port 3000"
else
  echo "⚠️ No process detected on port 3000"
fi

echo "Running build check..."
if npm run build >/dev/null 2>&1; then
  echo "✅ Build succeeded"
else
  echo "❌ Build failed"
fi

echo "Checking connectivity to Hugging Face..."
if command -v curl >/dev/null 2>&1 && [ -n "${VITE_HF_READ_TOKEN:-}" ]; then
  if curl -s -H "Authorization: Bearer $VITE_HF_READ_TOKEN" https://huggingface.co/api/whoami-v2 | grep -q name; then
    echo "✅ Hugging Face API reachable"
  else
    echo "❌ Hugging Face API not reachable"
  fi
else
  echo "ℹ️ Skipping HF connectivity check"
fi

echo "Checking logs for errors..."
if [ -d "./logs" ]; then
  if grep -i "error" ./logs/*.log >/dev/null 2>&1; then
    echo "❌ Errors found in logs:"
    grep -i "error" ./logs/*.log | tail -n 10
  else
    echo "✅ No errors in logs"
  fi
else
  echo "ℹ️ No logs directory"
fi

echo "Running E2E test..."
if command -v curl >/dev/null 2>&1 && command -v jq >/dev/null 2>&1; then
  RESPONSE=$(curl -s -X POST "$APP_URL" -H "Content-Type: application/json" -d "{\"question\": \"$QUESTION\"}" | jq -r '.answer // empty')
  if [ -z "$RESPONSE" ]; then
    echo "❌ No E2E response"
  else
    echo "✅ E2E OK — response: $RESPONSE"
  fi
else
  echo "⚠️ curl or jq missing — cannot run E2E"
fi

echo "Report saved to: $REPORT_FILE"
