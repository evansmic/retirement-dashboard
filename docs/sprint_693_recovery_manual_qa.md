# Sprint 693: Recovery Manual QA

## Purpose
Define a manual QA check for stale-version recovery.

## Check
- Open a plan and navigate to Results.
- Confirm regular Results still render when chunks load normally.
- If a stale deploy chunk occurs, confirm the app shows the reload notice instead of raw module text.
- Confirm Refresh page reloads the browser.

## Boundary
This sprint does not require synthetic chunk deletion, browser automation, or deployment monitoring.
