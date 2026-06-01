S1648 Top Ranked Selection

Purpose
- Add the first selector that can return a recommendation candidate id.

Selection rule
- If the recommendation execution planning package is complete and ranked evidence is ready, select the first ranked candidate.
- If prerequisites are blocked, return a blocked selection with no candidate id.

Boundary
- This is a modelled runtime result, not advice.
- The selector returns `saved: false`.
