# S1452 Builder Input Contract

The builder input contract lists the evidence a later runtime candidate builder needs before it can safely create variants.

Required evidence:
- runtime plan values,
- baseline result rows,
- monthly floor,
- capacity summary,
- candidate-set limits,
- blueprint statuses,
- output boundary.

Missing evidence blocks the builder and leaves ready blueprint ids empty.
