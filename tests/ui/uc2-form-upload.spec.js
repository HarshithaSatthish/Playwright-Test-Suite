import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";
import { LoginPage } from "../../pages/LoginPage.js";
import { AutomationPage } from "../../pages/AutomationPage.js";
import { FormPage } from "../../pages/FormPage.js";
import { assertUiCredentials } from "../../config/env.config.js";
import { testData } from "../../test-data/testData.js";
import { captureStepScreenshot } from "../../utils/helpers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const samplePdf = path.join(__dirname, "..", "..", "test-data", "sample-upload.pdf");

test.describe("UC2: Form upload with drag-drop", () => {
  test.beforeEach(async ({ page }) => {
    assertUiCredentials();
    const login = new LoginPage(page);
    await login.login();
    await login.assertLoggedInLanding();
  });

  test(
    "creates form, drags controls, uploads PDF, saves successfully",
    { tag: "@smoke" },
    async ({ page }) => {
      const automation = new AutomationPage(page);
      const form = new FormPage(page);

      await automation.openAutomationArea();
      await automation.openForms();
      await automation.clickCreateNew();

      const formName = `${testData.form.namePrefix}${Date.now()}`;
      await form.startNewForm(formName);

      await expect(form.formCanvas).toBeVisible({ timeout: 20000 });

      const componentLibrary = page
        .locator('[class*="palette" i]')
        .or(page.locator('[class*="component" i]'))
        .or(page.locator("aside"))
        .or(page.getByRole("navigation"));
      await expect(componentLibrary.first()).toBeVisible({ timeout: 15000 });

      const textboxPalette = page
        .getByText(/^text\s*box$/i)
        .or(page.getByRole("button", { name: /text\s*box/i }))
        .or(page.locator('[aria-label*="Text box" i]'));
      await expect(textboxPalette.first()).toBeVisible({ timeout: 15000 });

      const fileUploadPalette = page
        .getByText(/file upload|attachment|upload/i)
        .or(page.getByRole("button", { name: /file upload/i }))
        .or(page.locator('[aria-label*="file" i]'));
      await expect(fileUploadPalette.first()).toBeVisible({ timeout: 15000 });

      await form.dragTextboxToCanvas(testData.form.textboxLabel);
      await expect(
        form.formCanvas.getByText(testData.form.textboxLabel, { exact: false })
      ).toBeVisible({ timeout: 15000 });

      const formTextInput = page
        .locator(
          '#form-editor input[type="text"], #form-editor textarea, input[type="text"]:visible, textarea:visible'
        )
        .filter({ hasNot: page.locator('input[type="search"]') })
        .first();
      await expect(formTextInput).toBeVisible({ timeout: 15000 });
      await formTextInput.fill("Playwright demo input");
      await expect(formTextInput).toHaveValue("Playwright demo input");

      await form.dragFileUploadToCanvas();
      await expect(
        form.formCanvas.getByText(/file upload|upload|attachment/i)
      ).toBeVisible({ timeout: 15000 });

      const propertiesPanel = page
        .getByRole("complementary")
        .or(page.locator('[class*="properties" i]'))
        .or(page.locator('[class*="right-panel" i]'))
        .or(page.getByText(/^properties$/i));
      await expect(propertiesPanel.first()).toBeVisible({ timeout: 15000 });

      await captureStepScreenshot(page, "uc2_after_drag");

      await form.uploadPdf(samplePdf);
      await expect(page.locator('input[type="file"]').first()).toBeAttached();

      const saveResponsePromise = page
        .waitForResponse(
          (response) =>
            response.request().method() !== "GET" && response.status() < 400,
          { timeout: 20000 }
        )
        .catch(() => null);

      await form.saveForm();
      const saveResponse = await saveResponsePromise;
      expect(
        saveResponse,
        "Expected a successful non-GET backend response when saving the form"
      ).not.toBeNull();
      await form.assertSuccess();
    }
  );
});
