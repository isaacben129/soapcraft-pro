#!/usr/bin/env bash
set -euo pipefail
BASE='https://soapcraftpro.com'
page="$(curl --fail --silent --show-error --max-time 30 "$BASE/tools/batch-cost")"
printf '%s' "$page" | grep -q 'Batch Cost Calculator'
printf '%s' "$page" | grep -q 'Save Context'
printf '%s' "$page" | grep -q 'Share'
printf '%s' "$page" | grep -q 'Reset'
result="$(curl --fail --silent --show-error --max-time 30 -X POST "$BASE/api/calculate/batch-cost" -H 'content-type: application/json' --data '{"ingredientCosts":[{"name":"Olive oil","costPerUnit":0.01,"unit":"g","quantity":500}],"fragranceCost":2,"otherCosts":1,"batchYieldBars":10,"targetMargin":40}')"
printf '%s' "$result" | grep -q '"totalCost":8'
printf '%s' "$result" | grep -q '"costPerBar":0.8'
printf '%s' "$result" | grep -q '"suggestedPrice":1.12'
if curl --fail --silent --show-error --max-time 30 -o /dev/null "$BASE/api/calculate/batch-cost"; then
  :
fi
printf 'DEPLOYED_COST_CHECK PASS\nURL=%s\nRESULT=%s\n' "$BASE/tools/batch-cost" "$result"
