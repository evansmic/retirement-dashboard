#!/usr/bin/env bash
# Canonical regression suite. All checks must pass.
set -e
cd "$(dirname "$0")"

PROBES=(
  probe_phase4_final.js
  probe_phase5.js
  probe_phase5_e2e.js
  probe_phase5_intake.js
  probe_schema_migrate.js
  probe_presets.js
  probe_intake_roundtrip.js
  probe_mc_progressive.js
  probe_tax_benefit_helpers.js
  probe_pension_credit.js
  probe_tax_ages_64_72.js
  probe_validation_exports.js
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
