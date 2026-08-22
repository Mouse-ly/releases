# Auditable public-distribution task contracts

Every mutating pull request adds or modifies exactly one schema-valid `MLY-###.json` contract in this directory. Its filename, `id`, and `linear_issue` must match the one MLY identifier in the branch, the `[MLY-###]` PR-title prefix, and the single `Linear issue: MLY-###` PR-body line.

Copy `task-contract.json.example` to the canonical filename and replace every example value. Local runtime contracts and preflight receipts stay in `.mousely/task-contract.json` and `.mousely/preflight-receipt.json`; the adjacent `.gitignore` keeps those transient files out of commits.

The v1 public-safe workflow validates the manifest and locked release-only context, runs the public leakage and secret scans, and relies on repository review rules plus the human merge/release gates for contract/scope approval. It intentionally does not reference the private Mousely Ops action. Do not claim full trusted `verify-pr` enforcement in a public repository until a separately reviewed, base-owned public verifier is installed.
