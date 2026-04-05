import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage.js";
import { AutomationPage } from "../../pages/AutomationPage.js";
import { TaskBotPage } from "../../pages/TaskBotPage.js";
import { assertUiCredentials } from "../../config/env.config.js";
import { testData } from "../../test-data/testData.js";
import { captureStepScreenshot, step } from "../../utils/helpers.js";

/**
 * @param {import('@playwright/test').Page} page
 */
async function assertLoginPageVisible(page) {
  const userField = page.getByRole("textbox", {
    name: /user|email|login/i,
  });
  await expect(userField.first()).toBeVisible({ timeout: 20000 });
  await expect(page.locator('input[type="password"]').first()).toBeVisible();
  await expect(page.locator('input[type="password"]').first()).toHaveAttribute(
    "type",
    "password"
  );
  const loginSubmit = page
    .getByRole("button", { name: /log\s*in|sign\s*in/i })
    .or(page.locator('[data-testid="login-button"]'))
    .or(page.locator('button[type="submit"]'));
  await expect(loginSubmit.first()).toBeVisible();
}

/**
 * @param {import('@playwright/test').Page} page
 */
async function loginToApp(page) {
  assertUiCredentials();
  const login = new LoginPage(page);
  await login.goto();
  await assertLoginPageVisible(page);
  await login.login();
  await expect(page.url()).not.toContain("/login");
  await login.assertLoggedInLanding();
}

test.describe("UC1: Message Box Task Bot", () => {
  test(
    "TC-01 | Login page — username, password type, post-login URL",
    { tag: "@smoke" },
    async ({ page }) => {
      assertUiCredentials();
      const login = new LoginPage(page);
      await login.goto();
      await assertLoginPageVisible(page);
      await login.login();
      await expect(page.url()).not.toContain("/login");
      await login.assertLoggedInLanding();
    }
  );

  test.describe("Task Bot editor (logged in)", () => {
    test.beforeEach(async ({ page }) => {
      await loginToApp(page);
    });

    test("TC-02 | Navigate Automation → Task Bots → Create", async ({
      page,
    }) => {
      const automation = new AutomationPage(page);
      await automation.openAutomationArea();
      await automation.openTaskBots();
      await automation.clickCreateNew();
      const createFlow = page
        .getByText(/blank|empty|new task bot/i)
        .or(page.getByRole("option", { name: /blank/i }))
        .or(page.getByRole("textbox", { name: /name/i }));
      await expect(createFlow.first()).toBeVisible({ timeout: 20000 });
    });

    test("TC-03 | Create blank Task Bot — name value and editor canvas", async ({
      page,
    }) => {
      const automation = new AutomationPage(page);
      const taskBot = new TaskBotPage(page);
      await automation.openAutomationArea();
      await automation.openTaskBots();
      await automation.clickCreateNew();
      const name = `${testData.taskBot.namePrefix}${Date.now()}`;
      await taskBot.createBlankTaskBot(name);
      const nameField = page
        .locator(
          `#taskbot-name-display, input[value="${name}"]`
        )
        .first();
      await expect(nameField).toBeAttached();
      const editorCanvas = page
        .locator(".react-flow")
        .or(page.locator('[data-testid="bot-canvas"]'))
        .or(page.locator('[class*="canvas" i]'));
      await expect(editorCanvas.first()).toBeVisible({ timeout: 20000 });
    });

    test("TC-04 | Add Message Box and configure message text", async ({
      page,
    }) => {
      const automation = new AutomationPage(page);
      const taskBot = new TaskBotPage(page);
      await automation.openAutomationArea();
      await automation.openTaskBots();
      await automation.clickCreateNew();
      const name = `${testData.taskBot.namePrefix}${Date.now()}`;
      await taskBot.createBlankTaskBot(name);
      await taskBot.addMessageBox(testData.taskBot.messageBoxText);
      await expect(
        page.getByText(testData.taskBot.messageBoxText).first()
      ).toBeVisible({ timeout: 20000 });
    });

    test("TC-05 | Message Box on canvas and right panel visible", async ({
      page,
    }) => {
      const automation = new AutomationPage(page);
      const taskBot = new TaskBotPage(page);
      await automation.openAutomationArea();
      await automation.openTaskBots();
      await automation.clickCreateNew();
      const name = `${testData.taskBot.namePrefix}${Date.now()}`;
      await taskBot.createBlankTaskBot(name);
      await taskBot.addMessageBox(testData.taskBot.messageBoxText);
      await expect(
        page.getByText(testData.taskBot.messageBoxText).first()
      ).toBeVisible({ timeout: 20000 });
      await taskBot.assertMessageBoxVisibleOnCanvas();
      const taskBotRightPanel = page
        .getByRole("complementary")
        .or(page.locator('[class*="properties" i]'))
        .or(page.locator('[class*="right-panel" i]'))
        .or(page.locator('[class*="inspector" i]'));
      await expect(taskBotRightPanel.first()).toBeVisible({ timeout: 15000 });
    });

    test("TC-06 | Save Task Bot — step screenshots and success banner", async ({
      page,
    }) => {
      const automation = new AutomationPage(page);
      const taskBot = new TaskBotPage(page);
      const name = `${testData.taskBot.namePrefix}${Date.now()}`;

      await step(page, "Open Automation area", () =>
        automation.openAutomationArea()
      );
      await step(page, "Open Task Bots", () => automation.openTaskBots());
      await step(page, "Click Create new", () => automation.clickCreateNew());
      await step(page, "Create blank Task Bot", () =>
        taskBot.createBlankTaskBot(name)
      );
      await step(page, "Add Message Box", () =>
        taskBot.addMessageBox(testData.taskBot.messageBoxText)
      );
      await expect(
        page.getByText(testData.taskBot.messageBoxText).first()
      ).toBeVisible({ timeout: 20000 });
      await taskBot.assertMessageBoxVisibleOnCanvas();
      await step(page, "Capture before save", () =>
        captureStepScreenshot(page, "uc1_tc06_before_save")
      );
      await step(page, "Save bot", () => taskBot.saveBot());
      await step(page, "Assert success toast", () =>
        taskBot.assertSuccessToastOrBanner()
      );
    });
  });
});
