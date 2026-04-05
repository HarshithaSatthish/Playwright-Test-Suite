#!/usr/bin/env node
/**
 * Preflight checks before running tests (internship / CI friendly).
 * Does not print secret values.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}
function warn(msg) {
  console.warn(`  ⚠ ${msg}`);
}
function fail(msg) {
  console.error(`  ✗ ${msg}`);
  process.exitCode = 1;
}

console.log("\nplaywright-aa-framework — doctor\n");

const [major] = process.versions.node.split(".").map(Number);
if (major < 18) {
  fail(`Node.js 18+ required (found ${process.version})`);
} else {
  ok(`Node.js ${process.version}`);
}

const mustExist = [
  ["package.json", path.join(root, "package.json")],
  ["playwright.config.js", path.join(root, "playwright.config.js")],
  [".env.example", path.join(root, ".env.example")],
];

for (const [label, p] of mustExist) {
  if (fs.existsSync(p)) ok(`${label} present`);
  else fail(`${label} missing`);
}

const envPath = path.join(root, ".env");
if (fs.existsSync(envPath)) ok(".env present (values not shown)");
else warn("No .env — copy .env.example to .env for local UI/API runs");

const pdfPath = path.join(root, "test-data", "sample-upload.pdf");
if (fs.existsSync(pdfPath)) ok("test-data/sample-upload.pdf exists");
else warn("sample-upload.pdf missing — run: npm run generate:pdf");

try {
  execSync("npx playwright test --list", {
    cwd: root,
    stdio: "pipe",
    encoding: "utf8",
    env: { ...process.env, FORCE_COLOR: "0" },
  });
  ok("Playwright discovers tests (`npx playwright test --list`)");
} catch {
  fail("Playwright test discovery failed — run npm install && npx playwright install chromium");
}

console.log(`
  Next steps:
    • npm run test:smoke   — quick @smoke tests (login + API token checks)
    • npm run test         — full suite (needs .env + AA CE account)
    • npm run report       — HTML report after a run
`);

if (process.exitCode === 1) process.exit(1);
