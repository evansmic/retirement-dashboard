Sprint S1278 documented the failed-import state boundary.

The production validator returns a blocking result for incomplete clean reset files and does not expose a partially mapped plan to the app. This keeps failed imports side-effect-free at the plan-file boundary.

Current wrapped v2 files remain accepted.
