export class FormPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.formCanvas = page
      .locator('[data-testid="form-canvas"]')
      .or(page.locator('[class*="form-canvas" i]'))
      .first();
  }

  async startNewForm(name) {
    const newForm = this.page
      .getByRole("button", { name: /new form|create form/i })
      .or(this.page.getByText(/new form/i));

    if (await newForm.first().isVisible().catch(() => false)) {
      await newForm.first().click();
    }

    const nameInput = this.page
      .getByRole("textbox", { name: /name/i })
      .or(this.page.locator('input[name*="name" i]'));

    await nameInput.first().fill(name);

    let create = this.page.locator('[data-testid="form-create"]').first();

    if (!(await create.isVisible().catch(() => false))) {
      create = this.page
        .getByRole("button", { name: /create form|create|save|next/i })
        .first();
    }

    await create.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * React DnD friendly drag using mouse simulation (do not use dragTo).
   * @param {import('@playwright/test').Locator} componentLocator
   * @param {string} _label diagnostic label for traces
   */
  async dragComponentToCanvas(componentLocator, _label) {
    await componentLocator.waitFor({ state: "visible" });
    await this.formCanvas.waitFor({ state: "visible" });

    const cb = await this.formCanvas.boundingBox();
    const lb = await componentLocator.boundingBox();

    if (!cb || !lb) {
      throw new Error("dragComponentToCanvas: missing bounding box");
    }

    const sx = lb.x + lb.width / 2;
    const sy = lb.y + lb.height / 2;
    const dx = cb.x + cb.width / 2;
    const dy = cb.y + cb.height / 2;

    await this.page.mouse.move(sx, sy);
    await this.page.mouse.down();
    await this.page.waitForTimeout(300);

    await this.page.mouse.move(dx - 50, dy, { steps: 10 });
    await this.page.mouse.move(dx, dy, { steps: 10 });

    await this.page.waitForTimeout(300);
    await this.page.mouse.up();
    await this.page.waitForTimeout(800);
  }

  async dragTextboxToCanvas(labelText) {
    const textbox = this.page
      .getByText(/^text\s*box$/i)
      .or(this.page.getByRole("button", { name: /text\s*box/i }))
      .or(this.page.locator('[aria-label*="Text box" i]'));

    await this.dragComponentToCanvas(textbox.first(), labelText);
  }

  async dragFileUploadToCanvas() {
    const fileUpload = this.page
      .getByText(/file upload|attachment|upload/i)
      .or(this.page.getByRole("button", { name: /file upload/i }))
      .or(this.page.locator('[aria-label*="file" i]'));

    await this.dragComponentToCanvas(fileUpload.first(), "file-upload");
  }

  /**
   * @param {string} absoluteFilePath
   */
  async uploadPdf(absoluteFilePath) {
    const input = this.page.locator('input[type="file"]');
    await input.first().setInputFiles(absoluteFilePath);
  }

  async saveForm() {
    const save = this.page
      .getByRole("button", { name: /save/i })
      .or(this.page.getByLabel(/save/i));

    await save.first().click();
  }

  async assertSuccess() {
    const success = this.page.getByText(/saved successfully|success/i);
    await success.first().waitFor({ state: "visible", timeout: 45000 });
  }
}
