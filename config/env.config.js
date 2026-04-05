import dotenv from "dotenv";

dotenv.config();

const trimOrEmpty = (value) => (typeof value === "string" ? value.trim() : "");

export const env = {
  baseURL:
    trimOrEmpty(process.env.BASE_URL) ||
    "https://community.cloud.automationanywhere.digital",
  headless: process.env.HEADLESS !== "false",
  username: trimOrEmpty(process.env.AA_USERNAME) || "harshitha",
  password: (process.env.AA_PASSWORD ?? "").trim() || "harshitha21",
  apiUsername:
    trimOrEmpty(process.env.AA_API_USERNAME) ||
    (trimOrEmpty(process.env.AA_USERNAME) || "harshitha"),
  apiPassword:
    (process.env.AA_API_PASSWORD ?? "").length > 0
      ? process.env.AA_API_PASSWORD
      : (process.env.AA_PASSWORD ?? "").trim() || "harshitha21",
  apiBaseURL:
    trimOrEmpty(process.env.AA_API_BASE) ||
    trimOrEmpty(process.env.API_BASE_URL) ||
    trimOrEmpty(process.env.BASE_URL) ||
    "https://community.cloud.automationanywhere.digital",
  aaLoginPath: trimOrEmpty(process.env.AA_LOGIN_PATH) || "/v2/authentication",
  aaLiPath:
    trimOrEmpty(process.env.AA_LI_PATH) || "/iqbot/api/v2/learning-instances",
};

export function assertUiCredentials() {
  if (!env.username || !env.password) {
    throw new Error(
      "AA_USERNAME and AA_PASSWORD must be set in environment for UI tests."
    );
  }
}

export function assertApiCredentials() {
  if (!env.apiUsername || !env.apiPassword) {
    throw new Error(
      "AA_API_USERNAME/AA_API_PASSWORD (or AA_USERNAME/AA_PASSWORD) required for API tests."
    );
  }
}