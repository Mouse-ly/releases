import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? process.cwd());
const errors = [];
const checkerPath = ".github/scripts/public-release-safety.mjs";
const forbiddenRoots = [
  ".agents",
  ".codex",
  ".cursor",
  ".mousely",
  "docs/ai",
];
const forbiddenFiles = new Set([
  "mousely-context.lock",
  "mousely.repo.yaml",
  "CLAUDE.md",
  "GEMINI.md",
]);
const allowedLargeBinaryExtensions = new Set([
  ".apk", ".dmg", ".exe", ".ico", ".msi", ".msix", ".png", ".zip",
]);
const textPatterns = [
  ["internal issue identifier", /\bMLY-[1-9][0-9]*\b/g],
  ["private organization repository identifier", /\bMouse-ly\/(?!mousely-(?:windows|android|macos)-app\b)[A-Za-z0-9_.-]+\b/gi],
  ["private orchestration identifier", /\b(?:KARS|mousely-ops|kaden-macbook)\b/gi],
  ["personal filesystem path", /\/Users\/[A-Za-z0-9_.-]+\//g],
  ["internal agent metadata", /\b(?:agent_of_record|context_revision|request_receipt|source_revision)\b/gi],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ["GitHub token", /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/g],
];

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute).replaceAll("\\", "/");
    const metadata = await lstat(absolute);
    if (metadata.isSymbolicLink()) {
      errors.push(`${relative}: symbolic links are not permitted in a public release repository`);
    } else if (metadata.isDirectory()) {
      output.push(...await walk(absolute));
    } else if (metadata.isFile()) {
      output.push(relative);
    } else {
      errors.push(`${relative}: unsupported tracked path type`);
    }
  }
  return output;
}

const files = await walk(root);
for (const relative of files) {
  if (forbiddenFiles.has(relative) || forbiddenRoots.some((prefix) => relative === prefix || relative.startsWith(`${prefix}/`))) {
    errors.push(`${relative}: private agent/control-plane path is forbidden`);
  }
  if (relative === checkerPath) continue;
  const absolute = path.join(root, relative);
  const metadata = await lstat(absolute);
  if (metadata.size > 32 * 1024 * 1024 && !allowedLargeBinaryExtensions.has(path.extname(relative).toLowerCase())) {
    errors.push(`${relative}: file exceeds the 32 MiB public text-scan limit`);
    continue;
  }
  if (metadata.size > 32 * 1024 * 1024) continue;
  const bytes = await readFile(absolute);
  if (bytes.includes(0)) continue;
  const content = bytes.toString("utf8");
  for (const [label, pattern] of textPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) errors.push(`${relative}: contains ${label}`);
  }
}

const result = {
  schema_version: "mousely.public-release-safety.v1",
  ok: errors.length === 0,
  status: errors.length === 0 ? "public-release-safe" : "public-release-blocked",
  files_checked: files.length,
  errors,
};
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (errors.length) process.exitCode = 1;
