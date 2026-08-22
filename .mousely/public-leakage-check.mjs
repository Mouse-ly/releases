import { lstat, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? process.cwd());
const lock = JSON.parse(await readFile(path.join(root, "mousely-context.lock"), "utf8"));
const allowedSlices = new Set(["context/product/distribution-channels.md", "context/releases/branching-and-gates.md"]);
const errors = [];

for (const slice of lock.context_slices ?? []) {
  if (!allowedSlices.has(slice.source_path)) errors.push(`private or non-release context slice: ${slice.source_path}`);
}
if ((lock.context_slices ?? []).length !== allowedSlices.size) errors.push("public baseline must contain exactly the two release-compatible context slices");

for (const forbidden of [
  "docs/ai/generated/engineering-agent-operations.md",
  "docs/ai/generated/engineering-repository-map.md",
  "docs/ai/generated/engineering-repository-rollout.md",
  "docs/ai/generated/security-trust-boundaries.md",
  ".agents/skills/mousely-prototype",
  ".agents/skills/mousely-ui-review",
]) {
  try {
    await lstat(path.join(root, forbidden));
    errors.push(`forbidden public path exists: ${forbidden}`);
  } catch (error) {
    if (error.code !== "ENOENT") errors.push(`${forbidden}: ${error.message}`);
  }
}

const workflow = await readFile(path.join(root, ".github", "workflows", "mousely-public-baseline.yml"), "utf8");
if (/uses:\s*Mouse-ly\/mousely-ops/i.test(workflow)) errors.push("public workflow references the private Mousely Ops action");

process.stdout.write(`${JSON.stringify({ ok: errors.length === 0, status: errors.length === 0 ? "public-leakage-clear" : "public-leakage-blocked", errors }, null, 2)}\n`);
if (errors.length) process.exitCode = 1;
