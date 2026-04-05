/**
 * API base + paths come from env (see `.env.example`). Confirm paths match
 * DevTools → Network on your AA CE tenant (login POST, learning-instance POST/GET).
 * Successful login uses Authorization: Bearer <token> on subsequent calls.
 */
import { env } from "../config/env.config.js";
import { assertResponseTime, assertSchemaKeys } from "./helpers.js";

function joinUrl(base, pathPart) {
  const b = base.replace(/\/$/, "");
  const p = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
  return `${b}${p}`;
}

/**
 * Login body: only fields accepted by the Control Room authentication API.
 * Do not send grant_type, client_id, or other OAuth-style fields unless your tenant requires them.
 */
function buildLoginBody() {
  return {
    username: env.apiUsername,
    password: env.apiPassword,
  };
}

export class ApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
    this.token = null;
  }

  get apiRoot() {
    return env.apiBaseURL || env.baseURL;
  }

  async login() {
    const url = joinUrl(this.apiRoot, env.aaLoginPath);
    const started = Date.now();
    const response = await this.request.post(url, {
      data: buildLoginBody(),
      headers: { "Content-Type": "application/json" },
    });
    const elapsedMs = Date.now() - started;
    assertResponseTime(started, 5000);

    const status = response.status();
    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { raw: text };
    }

    if (status === 401 || status === 403) {
      return { ok: false, status, body, elapsedMs };
    }

    if (!response.ok()) {
      return { ok: false, status, body, elapsedMs };
    }

    const token =
      body?.token ||
      body?.data?.token ||
      body?.jwt ||
      body?.data?.jwt ||
      body?.access_token ||
      body?.data?.access_token;

    if (token) {
      this.token = token;
    }

    const contentType = response.headers()["content-type"] ?? "";

    return {
      ok: true,
      status,
      body,
      token: this.token,
      contentType,
      elapsedMs,
    };
  }

  authHeaders(extra = {}) {
    const h = { ...extra };
    if (this.token) {
      h.Authorization = `Bearer ${this.token}`;
    }
    return h;
  }

  /**
   * @param {Record<string, unknown>} payload
   */
  async createLearningInstance(payload) {
    const url = joinUrl(this.apiRoot, env.aaLiPath);
    const started = Date.now();
    const response = await this.request.post(url, {
      data: payload,
      headers: this.authHeaders({ "Content-Type": "application/json" }),
    });
    const elapsedMs = Date.now() - started;
    assertResponseTime(started, 5000);
    const body = await response.json().catch(() => ({}));
    return { response, body, elapsedMs };
  }

  /**
   * @param {string} instanceId
   */
  async getLearningInstance(instanceId) {
    const url = joinUrl(this.apiRoot, `${env.aaLiPath}/${instanceId}`);
    const started = Date.now();
    const response = await this.request.get(url, {
      headers: this.authHeaders(),
    });
    assertResponseTime(started, 5000);
    const body = await response.json().catch(() => ({}));
    return { response, body };
  }

  /**
   * Validates learning instance shape (id, name, status) on nested or flat payloads.
   * @param {unknown} body
   */
  static validateLearningInstanceSchema(body) {
    const candidate =
      body && typeof body === "object" && body.data && typeof body.data === "object"
        ? body.data
        : body;
    assertSchemaKeys(candidate, ["id", "name", "status"]);
  }
}
