#!/usr/bin/env bash
# Canonical regression suite. All 55 checks must pass.
set -e
cd "$(dirname "$0")"

PROBES=(
  probe_phase4_final.js
  probe_phase5.js
  probe_phase5_e2e.js
  probe_phase5_intake.js
)

total_pass=0
total_fail=0

for p in "${PROBES[@]}"; do
  echo "════════════════════════════════════════"
  echo "  $p"
  echo "════════════════════════════════════════"
  out=$(node "$p" 2>&1) || true
  echo "$out" | tail -4
  pass=$(echo "$out" | grep -E "^Passed:" | awk '{print $2}')
  fail=$(echo "$out" | grep -E "^Failed:" | awk '{print $2}')
  total_pass=$((total_pass + pass))
  total_fail=$((total_fail + fail))
  echo
done

echo "════════════════════════════════════════"
echo "  TOTAL: $total_pass passed, $total_fail failed"
echo "════════════════════════════════════════"

if [ "$total_fail" -gt 0 ]; then
  exit 1
fi
