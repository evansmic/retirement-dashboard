# Future Raw Payload Policy

## Decision

After the clean saved-format reset, block raw unwrapped JSON payloads.

Only wrapped future clean-format plan files should be accepted.

## Message

> This file is not a supported plan file. Please start a new plan or open a saved plan from this preview.

## Rationale

- Raw JSON files can be mistaken for older preview payloads.
- Wrapped plan files give the loader a clear file type and version boundary.
- Blocking raw payloads reduces the risk of partially loading unsupported fields.

## Allowed

- Wrapped future clean-format plan files.

## Blocked

- Raw unwrapped JSON payloads.
- Old phased-spending preview payloads.
- Unknown future raw payloads.

## Boundary

This is a future reset policy only. Current raw v2 payload support remains unchanged until the reset is explicitly implemented.

