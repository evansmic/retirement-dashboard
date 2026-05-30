# S1524 Next Scoring Implementation

Recommended next package: candidate scoring execution implementation.

The next package should calculate runtime-only scores for simulated variants using:
- floor coverage first,
- gap repair only when relevant,
- disruption penalty,
- tax as secondary review,
- survivor and estate as review caveats,
- current plan tie-breaker.

It should still avoid optimizer search, saved output, funding traces, annual sequencing, and UI.
