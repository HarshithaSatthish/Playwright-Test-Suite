import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} name
 */
export async function captureStepScreenshot(page, name) {
  const safe = name.replace(/[^a-z0-9-_]/gi, "_");
  const dir = path.join(root, "playwright-report", "screenshots");
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${Date.now()}_${safe}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

/**
 * Run a named UI step and capture a full-page screenshot after it (debug / submission trace).
 * @param {import('@playwright/test').Page} page
 * @param {string} name
 * @param {() => void | Promise<void>} fn
 */
export async function step(page, name, fn) {
  console.log(` → ${name}`);
  await fn();
  const dir = path.join(root, "playwright-report", "screenshots");
  fs.mkdirSync(dir, { recursive: true });
  const safe = name.replace(/\s+/g, "-").replace(/[^a-z0-9-_]/gi, "");
  await page.screenshot({
    path: path.join(dir, `${safe}-${Date.now()}.png`),
    fullPage: true,
  });
}

/**
 * @param {number} start
 * @param {number} maxMs
 */
export function assertResponseTime(start, maxMs = 5000) {
  const elapsed = Date.now() - start;
  if (elapsed >= maxMs) {
    throw new Error(`Response time ${elapsed}ms exceeded limit ${maxMs}ms`);
  }
}

/**
 * @param {unknown} body
 * @param {string[]} keys
 */
export function assertSchemaKeys(body, keys) {
  if (!body || typeof body !== "object") {
    throw new Error("Response body must be an object");
  }
  for (const key of keys) {
    if (!(key in body)) {
      throw new Error(`Missing schema key: ${key}`);
    }
  }
}
