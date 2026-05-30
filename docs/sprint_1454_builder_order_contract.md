# S1454 Builder Order Contract

The builder order contract records the future order of buildable blueprints.

Ordering rules:
- baseline first,
- spending repair before work-timing repair,
- review-only items stay out of the build order,
- deferred items remain deferred,
- blocked inputs produce no build order.

This is still only planning metadata. It does not build plan variants.
