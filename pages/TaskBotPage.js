import { expect } from "@playwright/test";

export class TaskBotPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async createBlankTaskBot(name) {
    const blank = this.page
      .getByText(/blank|empty|new task bot/i)
      .or(this.page.getByRole("option", { name: /blank/i }));

    if (await blank.first().isVisible().catch(() => false)) {
      await blank.first().click();
    }

    const nameInput = this.page
      .getByRole("textbox", { name: /name/i })
      .or(this.page.locator('input[name*="name" i]'))
      .or(this.page.locator('[data-testid="bot-name-input"]'));

    await expect(nameInput.first()).toBeVisible({ timeout: 15000 });
    await nameInput.first().fill(name);

    const explicitCreate = this.page
      .locator(
        '#taskbot-create-confirm, [data-testid="create-bot"], button#create-bot'
      )
      .first();

    if (await explicitCreate.isVisible().catch(() => false)) {
      await explicitCreate.click();
    } else {
      const create = this.page
        .getByRole("button", { name: /create|save|next/i })
        .or(this.page.locator('[data-testid="create-bot"]'));

      // Prefer the bottom-most visible create action to avoid top toolbar buttons.
      await create.last().click();
    }

    const editorCanvas = this.page
      .locator('[data-testid="bot-canvas"], .react-flow, [class*="canvas" i]')
      .first();

    await expect(editorCanvas).toBeVisible({ timeout: 20000 });
    await this.page.waitForLoadState("domcontentloaded");
  }

  async openActionsPalette() {
    const actions = this.page
      .getByRole("tab", { name: /actions|commands/i })
      .or(this.page.getByText(/^actions$/i));

    if (await actions.first().isVisible().catch(() => false)) {
      await actions.first().click();
    }
  }

  async addMessageBox(messageText) {
    await this.openActionsPalette();

    const search = this.page
      .getByRole("searchbox")
      .or(this.page.getByPlaceholder(/search/i))
      .or(this.page.locator('input[type="search"]'));

    if (await search.first().isVisible().catch(() => false)) {
      await search.first().fill("message");
      await this.page.waitForTimeout(400);
    }

    const messageBox = this.page.locator(
      '#message-box-item:visible, button:has-text("Message Box"):visible, [aria-label*="Message box" i]:visible'
    );

    await messageBox.first().dblclick({ timeout: 20000 });

    const canvas = this.page
      .locator('[class*="canvas" i]')
      .or(this.page.locator('[data-testid="bot-canvas"]'))
      .or(this.page.locator(".react-flow"));

    await canvas.first().waitFor({ state: "visible", timeout: 20000 });

    const msgInput = this.page
      .getByRole("textbox", { name: /message|text/i })
      .or(this.page.locator('textarea'))
      .or(this.page.locator('[aria-label*="message" i]'));

    await msgInput.first().fill(messageText, { timeout: 15000 });
  }

  async saveBot() {
    const save = this.page
      .getByRole("button", { name: /save/i })
      .or(this.page.getByLabel(/save/i));

    await save.first().click();
  }

  async assertSuccessToastOrBanner() {
    const success = this.page
      .getByText(/saved successfully|successfully saved|success/i)
      .or(this.page.getByRole("alert"));

    await success.first().waitFor({ state: "visible", timeout: 45000 });
  }

  async assertMessageBoxVisibleOnCanvas() {
    const onCanvas = this.page
      .locator(".react-flow")
      .getByText(/message box/i)
      .or(this.page.locator('[class*="node" i]').getByText(/message/i));

    await onCanvas.first().waitFor({ state: "visible", timeout: 20000 });
  }
}
