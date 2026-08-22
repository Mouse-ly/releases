# Auditable PR task contracts

Every pull request adds or modifies exactly one schema-valid `MLY-###.json` contract in this directory. Its filename, `id`, and `linear_issue` must match the one MLY identifier in the branch, the `[MLY-###]` PR-title prefix, and the single `Linear issue: MLY-###` PR-body line.

Copy `task-contract.json.example` to the canonical filename and replace every example value. Local runtime contracts and preflight receipts stay in `.mousely/task-contract.json` and `.mousely/preflight-receipt.json`; the adjacent `.gitignore` keeps those transient files out of commits.

CI reads the committed contract from the exact PR head, validates its regular-file mode and repository/base binding, derives requester authority from the base-owned GitHub event and the contract's hash-bound request receipt reference, secret-scans the complete diff, and runs `guard-diff` from the exact PR base SHA. Proof, reviewer approval, merge, deployment, release, and other human gates are not inferred by this check.
