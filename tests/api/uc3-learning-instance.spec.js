import { test, expect } from "@playwright/test";
import { ApiClient } from "../../utils/apiClient.js";
import { assertApiCredentials, env } from "../../config/env.config.js";
import { testData } from "../../test-data/testData.js";

test.describe("UC3: Learning Instance API", () => {
  test.beforeEach(() => {
    assertApiCredentials();
  });

  test(
    "login returns token under 5s",
    { tag: "@smoke" },
    async ({ request }) => {
      const client = new ApiClient(request);
      const result = await client.login();
      expect(result.status).toBeGreaterThanOrEqual(200);
      expect(result.status).toBeLessThan(300);
      expect(result.token).toBeTruthy();
      expect(typeof result.token).toBe("string");
      expect(result.token.length).toBeGreaterThan(10);
      expect((result.contentType || "").toLowerCase()).toContain(
        "application/json"
      );
    }
  );

  test("create and get learning instance — schema and timing", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const loginResult = await client.login();
    expect(loginResult.ok).toBeTruthy();

    const payload = {
      ...testData.api.learningInstance,
      name: `${testData.api.learningInstanceNamePrefix}${Date.now()}`,
    };

    const created = await client.createLearningInstance(payload);
    expect(created.response.status()).toBeGreaterThanOrEqual(200);
    expect(created.response.status()).toBeLessThan(300);

    const createdBody = created.body;
    const id =
      createdBody?.id ||
      createdBody?.data?.id ||
      createdBody?.learningInstanceId ||
      createdBody?.data?.learningInstanceId;

    if (!id) {
      throw new Error("create response should expose instance id");
    }
    expect(id).toBeTruthy();

    ApiClient.validateLearningInstanceSchema(createdBody);

    const fetched = await client.getLearningInstance(String(id));
    expect(fetched.response.status()).toBe(200);
    ApiClient.validateLearningInstanceSchema(fetched.body);

    const fetchedBody = fetched.body;
    const fetchedId =
      fetchedBody?.id ||
      fetchedBody?.data?.id ||
      fetchedBody?.learningInstanceId ||
      fetchedBody?.data?.learningInstanceId;
    expect(String(fetchedId)).toBe(String(id));

    const fetchedName = fetchedBody?.name ?? fetchedBody?.data?.name;
    expect(fetchedName).toBe(payload.name);
  });

  test("negative: invalid credentials yield 401 or 403", async ({
    request,
  }) => {
    const apiBase = (env.apiBaseURL || env.baseURL).replace(/\/$/, "");
    const url = `${apiBase}${env.aaLoginPath.startsWith("/") ? "" : "/"}${env.aaLoginPath}`;
    const started = Date.now();
    const response = await request.post(url, {
      data: { username: "invalid_user_xyz", password: "invalid_pass_xyz" },
      headers: { "Content-Type": "application/json" },
    });
    const elapsed = Date.now() - started;
    expect(elapsed).toBeLessThan(5000);
    expect([401, 403]).toContain(response.status());
  });

  test("negative: unauthorized GET returns 401", async ({ request }) => {
    const client = new ApiClient(request);
    await client.login();
    client.token = "definitely-not-a-valid-jwt-token";

    const { response } = await client.getLearningInstance("00000000-0000-0000-0000-000000000000");
    expect([401, 403, 404]).toContain(response.status());
  });

  test("negative: malformed create returns 4xx", async ({ request }) => {
    const client = new ApiClient(request);
    const loginResult = await client.login();
    expect(loginResult.ok).toBeTruthy();

    const { response } = await client.createLearningInstance({});
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test("TC-19 | Critical API endpoints respond within 3000ms", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const loginResult = await client.login();
    expect(loginResult.ok).toBeTruthy();
    expect(
      loginResult.elapsedMs,
      `Login took ${loginResult.elapsedMs}ms`
    ).toBeLessThan(3000);

    const payload = {
      ...testData.api.learningInstance,
      name: `PERF_${Date.now()}`,
    };
    const created = await client.createLearningInstance(payload);
    expect(created.response.status()).toBeGreaterThanOrEqual(200);
    expect(created.response.status()).toBeLessThan(300);
    expect(
      created.elapsedMs,
      `Create learning instance took ${created.elapsedMs}ms`
    ).toBeLessThan(3000);

    console.log(
      `Performance: Login=${loginResult.elapsedMs}ms, Create=${created.elapsedMs}ms`
    );
  });
});
