import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

/**
 * Ensures report artifact directories exist before the run.
 */
export default async function globalSetup() {
  const dirs = [
    path.join(root, "playwright-report", "screenshots"),
    path.join(root, "playwright-report", "videos"),
  ];
  for (const dir of dirs) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
}
