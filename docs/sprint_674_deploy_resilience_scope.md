# Sprint 674: Deploy Resilience Scope

## Purpose
Clarify that deploy resilience is a small local UI recovery improvement, not a new infrastructure project.

## Outcome
- The app can tell a user to refresh after a stale deploy chunk.
- No cache-busting strategy, service worker, version endpoint, or release channel was added.
- The current Vercel static deployment model remains unchanged.

## Boundary
This sprint does not add accounts, servers, background workers, or deployment monitoring.
