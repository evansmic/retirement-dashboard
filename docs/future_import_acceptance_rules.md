# Future Import Acceptance Rules

## Purpose

Define what the future clean saved format should accept or block.

## Rules

### Accept

Accept plan files created with the future clean saved format.

Reason: the new format will explicitly carry minimum expenses and spending-path assumptions.

### Block Older Preview Files

Block older preview files from the phased-spending schema.

Message:

> This plan was created with an earlier preview format. Please start a new plan.

Reason: old desired-spending fields should not be interpreted as minimum expenses.

### Block Unsupported Future Files

Block files from a newer unsupported future format.

Message:

> This plan was created with a newer format this preview cannot open. Please use the newer planner version.

Reason: unsupported future files could include fields this version would silently drop.

### Defer Raw Payload Decision

Decide later whether raw unwrapped JSON payloads should remain accepted.

Reason: the future reset may be cleaner if only wrapped local plan files are accepted.

## Boundary

These rules are not wired into current imports yet.

