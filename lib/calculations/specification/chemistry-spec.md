# Chemistry verification gate

Status: IMPLEMENTATION READY / PUBLIC RELEASE BLOCKED

The implementation is deterministic and fail-closed. Public chemistry requires:

1. Ingredient source manifest record with verified provenance.
2. Independent domain reviewer approval.
3. Hand-calculated fixtures matching the formulas in `product/CALCULATION-SPEC.md`.
4. Cross-calculator comparison fixtures.
5. A release review performed by someone other than the implementation actor.

This artifact records the gate; it does not impersonate domain approval.
