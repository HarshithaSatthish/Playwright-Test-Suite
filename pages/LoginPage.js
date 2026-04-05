import { env } from "../config/env.config.js";

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
  }

  async login(username = env.username, password = env.password) {
    await this.goto();

    const userField = this.page.getByRole("textbox", {
      name: /user|email|login/i,
    });
    const passField = this.page.getByRole("textbox", {
      name: /password/i,
    }).or(this.page.locator('input[type="password"]'));

    await userField.first().waitFor({ state: "visible", timeout: 20000 });
    await userField.first().fill(username);
    await passField.first().fill(password);

    const submit = this.page
      .getByRole("button", { name: /log\s*in|sign\s*in/i })
      .or(this.page.locator('[data-testid="login-button"]'))
      .or(this.page.locator('button[type="submit"]'));

    await submit.first().click();

    await this.page.waitForLoadState("networkidle").catch(() => {});
    await this.dismissCookieBannerIfPresent();
  }

  async dismissCookieBannerIfPresent() {
    const accept = this.page.getByRole("button", {
      name: /accept|agree|continue/i,
    });
    if (await accept.first().isVisible().catch(() => false)) {
      await accept.first().click({ timeout: 3000 }).catch(() => {});
    }
  }

  async assertLoggedInLanding() {
    const automation = this.page.getByRole("link", { name: /automation/i }).or(
      this.page.getByText(/automation/i)
    );
    const home = this.page.getByText(/home|dashboard|control room/i);
    await automation.or(home).first().waitFor({
      state: "visible",
      timeout: 60000,
    });
  }
}
