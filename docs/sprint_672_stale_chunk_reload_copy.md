# Sprint 672: Stale Chunk Reload Copy

## Purpose
Handle stale deployed JavaScript chunks with plain copy.

## Outcome
- Dynamic import failures now show a calm reload message.
- The message avoids exposing raw module-fetch text to consumers.
- This supports Vercel deploys where an open browser tab references an older hashed chunk.

## Boundary
This sprint does not change routing, deployment configuration, calculations, schemas, or saved plans.
