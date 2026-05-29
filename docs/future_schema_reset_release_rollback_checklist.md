# Future Schema Reset Release And Rollback Checklist

## Purpose

Define release evidence and rollback gates for the future clean saved-format reset.

## Before Release

### Prior V2-Compatible Build

Required evidence:

- Known commit or deployment before reset wiring.
- Verification record for prior build.
- Clear instruction for returning to prior build.

Stop if missing: yes.

### Tester Fresh-Start Notice

Required evidence:

- Tester instructions say old preview files are disposable.
- Block message is included.
- No request to send private plan files.

Stop if missing: yes.

## During Release

### Old-Preview Import Block Smoke

Required evidence:

- Old-preview fixture is blocked.
- No partial plan state loads.
- Current plan remains usable after failed import.

Stop if missing: yes.

### New-Format Import Acceptance Smoke

Required evidence:

- New-format fixture opens.
- Minimum expense field is retained.
- Capacity answer is calculated at runtime.

Stop if missing: yes.

## After Release

### Tester Confusion Watch

Required evidence:

- Feedback channel ready.
- Old-file confusion notes captured outside app.
- Rollback decision owner identified.

Stop if missing: no.

## Boundary

This checklist is planning-only. It does not change imports, deployments, saved files, examples, or UI.

