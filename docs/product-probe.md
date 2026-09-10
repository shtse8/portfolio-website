# Public projection delivery contract

`portfolio.public-projection.v1` accepts only read-only public API projections. It does not accept WEB-CHAT, browser UX, recovery, performance or soak. It never invokes `/chat`, including when chat is ready. Apps must retain those separately required product assertions; this contract cannot replace full product acceptance.

Apps builds an immutable runner from this source with `Dockerfile.product-probe` through its normal artifact authority. Entrypoint: `bun scripts/apps-product-probe.ts`. `APPS_PRODUCT_PROBE_CONTEXT` is canonical Protobuf JSON, paired with JCS SHA-256 `APPS_PRODUCT_PROBE_CONTEXT_DIGEST`. Intent must select this contract, immutable runner digest, policy revision, exact assertion IDs and one selected HTTPS routed API target with member ID, observation digest, generation and revision UID. Runtime authority binds selected source and all proxy/downstream members before admission; this adapter cannot infer source from revision UID.

- `WEB-PUBLIC-STATS`: live, non-stale public-only stats, valid counts and real repository data with timestamp within one hour.
- `WEB-PUBLIC-PROJECTS`: nonempty real repository identities/URLs and fresh projection timestamp.
- `WEB-PUBLIC-ACTIVITY`: non-stale live public-only activity revision, valid counts and fresh timestamp. `stale` is the API's optional failure marker (absent on live serving, `true` on stale serving), so only `stale: true` is rejected.
- `WEB-PUBLIC-CLAIMS`: public claim-pack schema, promise and explicitly public repository activity definition.
- `WEB-PUBLIC-DOWNLOADS`: flagship alias resolves to scoped package with nonempty real daily series and positive total equal to the series sum; fresh projection timestamp.

These assertions tighten the read-only parts of `scripts/api-smoke.sh`; they deliberately do not run its optional chat operation. Freshness allows at most one minute future skew. Responses are owning API evidence, not independent GitHub/npm provenance verification. Every request is GET to the selected origin; redirects are rejected. Missing, stale or malformed data fails. A ≤4096-byte `/dev/termination-log` receipt contains the context digest, exactly one PASSED/FAILED status per required assertion, and RFC3339 start/finish times. Process success or a skipped assertion cannot establish a product postcondition. Live execution needs root admission.
