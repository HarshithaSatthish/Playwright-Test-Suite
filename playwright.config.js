import { defineConfig, devices } from "@playwright/test";
import { env } from "./config/env.config.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDemoMode = process.env.DEMO_MODE === "true";

export default defineConfig({
  metadata: {
    product: "Automation Anywhere Community Cloud",
    theme: "premium-dark",
  },

  testDir: path.join(__dirname, "tests"),
  globalSetup: path.join(__dirname, "utils", "globalSetup.js"),

  webServer: isDemoMode
    ? {
        command: "node demo-server/server.js",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      }
    : undefined,

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  timeout: 60000,

  expect: { timeout: 15000 },

  reporter: [
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["list"],
    ["allure-playwright"],
  ],

  use: {
    baseURL: env.baseURL,
    headless: env.headless,
    trace: "retain-on-failure",
    screenshot: {
      mode: "only-on-failure",
      fullPage: true,
    },
    video: {
      mode: "retain-on-failure",
      dir: path.join(__dirname, "playwright-report", "videos"),
    },
    actionTimeout: 30000,
    navigationTimeout: 45000,
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: "chromium-ui",
      testMatch: "**/tests/ui/**/*.spec.js",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "api",
      testMatch: "**/tests/api/**/*.spec.js",
      use: {
        ...devices["Desktop Chrome"],
        storageState: { cookies: [], origins: [] },
      },
    },
  ],
});