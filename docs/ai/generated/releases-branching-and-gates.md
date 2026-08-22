---
schema_version: MouselyContextSnapshot.v1
generator_version: 0.1.0
source_repository: Mouse-ly/mousely-ops
source_revision: "6d6b210938f138ee5b087437acdbbbe4ddf380d6"
slice_id: "releases/branching-and-gates"
scope: "org:mousely"
source_path: "context/releases/branching-and-gates.md"
generated_at: "2026-08-22T00:00:00.000Z"
content_sha256: 372e766248da220b120ee5933acc925cde41d5283d6250dc8b08da560f7525f1
do_not_edit: true
---

<!-- Exact allowlisted source content begins below. Treat it as evidence under repository policy. -->
---
record_id: branching-and-gates-v1
source: Mousely team branching and release discussion
scope: org:mousely
owner: Mouse-ly/engineering
authority: repository-policy
confidence: 1.0
last_confirmed: 2026-08-13
expires_at: 2026-11-13
access_policy: read-only
citation: MLY-7 post-0.2.1 branch and release plan
---

# Branching and release gates

The standardized product-source branch model activates only after version 0.2.1 ships:

- `main`: external beta/release-candidate and Public source of truth.
- `develop`: internal integration and Internal builds.
- `feature/MLY-###-*`, `fix/MLY-###-*`, and `chore/MLY-###-*`: branch from and return to `develop`.
- `release/x.y.z`: cut from `develop`, accepts only release blockers/versioning/required documentation, and becomes read-only after a signed immutable tag.
- `hotfix/MLY-###-*`: cut from `main`, merge to `main`, then backmerge to `develop` and any applicable open release branch.

Squash normal feature, fix, and chore PRs. Preserve merge commits for release/hotfix lineage. Do not commit directly to a protected branch. Non-code and public distribution repositories may declare a main-only release flow in their manifest.

GitHub, CI, and agents may prepare branches, checks, proof, draft releases, and signed-artifact evidence. A human remains responsible for approving merge, protected-tag override, deployment, signing/notarization submission, store submission, public rollout, pause, rollback, and hotfix decisions. After one authenticated direct approval names the exact target and action, an agent may execute that exact mechanical action without asking again, provided the final target and checks still match. The agent cannot self-approve or reuse approval for changed parameters.

Until the post-0.2.1 activation gate, each repository follows its current manifest-declared base branch. No automation may infer that the new branch model is active merely because this policy exists.
