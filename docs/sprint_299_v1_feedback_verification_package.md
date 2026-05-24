# Sprint 299: V1 Feedback Verification Package

## Summary

Sprint 299 defines the verification package for the v1 feedback checkpoint.

## Outcome

- Required verification remains `npm test`, `npm run build`, the two parity probes, `./probes/run_all.sh`, and the no-plan-file check.
- The known route-probe `listen EPERM 127.0.0.1:5173` caveat remains non-blocking when it is the only full-probe failure.
- No private `.plan.json` files should be created.

## Boundary

Verification evidence is not persisted into saved plan files.
