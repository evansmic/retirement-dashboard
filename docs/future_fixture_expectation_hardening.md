# Future Fixture Expectation Hardening

Status: planning-only.

This package hardens the reset fixture expectations without wiring production import behavior.

The goal is to make the later clean schema reset safer by defining what test-only fixtures must prove before any loader changes happen.

## Fixture Expectations

- Accepted new-format fixtures must keep calculated answers out of saved files.
- Accepted fixtures must carry minimum monthly expense inputs directly.
- Old preview fixtures must block plainly and avoid migration fallback.
- Unsupported future fixtures must block before unknown fields can be dropped.
- Raw unwrapped payloads must remain blocked after the reset decision.

## Boundary

No `.plan.json` files are created in this package. No production loader behavior changes.
