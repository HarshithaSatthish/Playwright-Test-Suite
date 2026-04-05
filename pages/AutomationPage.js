export class AutomationPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async openAutomationArea() {
    const automation = this.page
      .getByRole("link", { name: /automation/i })
      .or(this.page.getByRole("menuitem", { name: /automation/i }))
      .or(this.page.locator('a[href*="automation"]'));

    await automation.first().click({ timeout: 30000 });
    await this.page.waitForLoadState("domcontentloaded");
  }

  async openTaskBots() {
    const taskBots = this.page
      .getByRole("link", { name: /task\s*bot/i })
      .or(this.page.getByText(/^task\s*bots?$/i))
      .or(this.page.locator('[aria-label*="Task bot" i]'));

    await taskBots.first().click({ timeout: 30000 });
  }

  async openForms() {
    const forms = this.page
      .getByRole("link", { name: /form/i })
      .or(this.page.getByText(/^forms?$/i))
      .or(this.page.locator('[aria-label*="Form" i]'));

    await forms.first().click({ timeout: 30000 });
  }

  async clickCreateNew() {
    const create = this.page
      .getByRole("button", { name: /create|new/i })
      .or(this.page.getByLabel(/create/i));

    await create.first().click({ timeout: 30000 });
  }
}
