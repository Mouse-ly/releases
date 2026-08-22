---
schema_version: MouselyContextSnapshot.v1
generator_version: 0.1.0
source_repository: Mouse-ly/mousely-ops
source_revision: "c73ea1e51a06591bde21621aedd537f2eafb2fd6"
slice_id: "product/distribution-channels"
scope: "org:mousely"
source_path: "context/product/distribution-channels.md"
generated_at: "2026-08-22T00:00:00.000Z"
content_sha256: cdea0207184b47acf27afc96c5de7cdc581f0ac4a6bbc49c3510d07e972d5007
do_not_edit: true
---

<!-- Exact allowlisted source content begins below. Treat it as evidence under repository policy. -->
---
record_id: distribution-channels-v1
source: Kaden and Mousely team release discussion
scope: org:mousely
owner: Mouse-ly/product
authority: repository-policy
confidence: 1.0
last_confirmed: 2026-08-13
expires_at: 2026-11-13
access_policy: read-only
citation: MLY-7 release and channel plan
---

# Product stages and distribution channels

Mousely work moves through Prototype, Feature Preview, Internal, Canary, Early Access, and Public. Public is the mainstream store/download experience and is not marketed with an internal channel name. Early Access is an approved opt-in group that tests a reviewed candidate before Public. Canary is the smallest trusted external subset. Internal is the team and eligible internal testers. Prototype and Feature Preview remain local, ephemeral, or PR-scoped until humans select the direction.

Current platform maturity is independent of channel:

- iOS: Beta
- Windows: Beta
- Android: Alpha
- macOS: Coming Soon until public-readiness approval

The public web route `/beta` is legacy. It must permanently redirect to `/early-access` with HTTP 308 after the associated web PR is reviewed, and canonical metadata, Open Graph data, sitemap/internal links, analytics, and duplicate signup funnels must be updated together. Early Access opt-in/manual approval remains distinct from Public distribution.

For iOS, `develop` eventually feeds TestFlight Internal. Reviewed release candidates progress through Canary and Early Access, promoting the same build where possible. A human approves App Store submission and the public phased rollout.
