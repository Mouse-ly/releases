---
name: mousely-proof-bundle
description: Assemble and verify exact-commit evidence for Mousely application, harness, documentation, or release-readiness work. Use after implementation and deterministic evaluation, before PR handoff or readiness claims, when review lanes must be derived from the final diff, or when screenshots, device evidence, documentation impact, preview expiry, review freshness, and cleanup must be recorded.
---

# Mousely Proof Bundle

Produce evidence pinned to the final commit and diff. Never infer proof from an earlier commit or a writer's claim.

## Bundle workflow

1. Stop mutation and capture the final commit SHA plus a deterministic final-diff hash.
2. Run `guard-diff` against the approved `TaskContract.v1`. Any unrelated edit or forbidden path blocks proof. More than 200 non-generated changed lines adds outside/adversarial review.
3. Run the smallest applicable deterministic eval suite. Zero applicable executed cases fails. Timeout, unavailable evaluator, missing artifact, or unparsable result is inconclusive, never pass.
4. Run `docs-impact`. Ship straightforward factual updates in the same PR. Documentation debt remains `needs-human` until a trusted Linear receipt binds the exact issue, repository, commit, approval, approver, and writer. Flag marketing copy, brand-sensitive diagrams, and taste-sensitive screenshots for human review.
5. Independently derive change classes and required review lanes from the final diff. Union them with initial task risk. Require a signed or connector-derived receipt for every lane, binding reviewer identity, writer identity, verdict, lane, and exact final commit; compute independence instead of accepting a supplied boolean. Any material commit makes affected reviews stale.
6. Add behavior changed, checks, typed browser/device/accessibility/reduced-motion rows, evidence IDs, media hashes and attestation references, documentation result, preview URL and expiry, limitations, decisions, and cleanup evidence to `ProofBundle.v1`. Every row must reference an existing hashed local or trusted remote artifact. Every check requires an independent attestation binding repository, contract/context/manifest, exact commit, result, evidence hashes, writer, and attestor. Physical validation also requires a trusted device-attestation receipt binding the real device/build/install identity.
7. Stop with a clean index/worktree, then run `review-status` and `verify-proof` against the tracked canonical task contract, root context lock, root repository manifest, and signed canonical `.mousely/preflight-receipt.json`. Full context verification is mandatory and the proof base must equal the authenticated task-start SHA. HMAC-signed local review/check/media/device/debt receipts do not authorize readiness; use a supported pinned public-key issuer or trusted external connector, otherwise return `needs-human`. A dirty repository, mismatched repository/source/context/base binding, missing or unauthenticated check evidence, stale review, human product/taste decision, failed/inconclusive/not-applicable required check, missing manifest-required target, unresolved evidence ID, unhashed or secret-bearing local artifact, unattested remote/device evidence, unverified documentation debt, or Simulator presented as physical-iPhone evidence blocks readiness.

Use only these verdicts: `ready`, `missing-review`, `stale-review`, or `needs-human`. Readiness does not authorize merge, deployment, release, publishing, signing, or store submission.
