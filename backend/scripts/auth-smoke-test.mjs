import "../src/config/env.js";
import { app } from "../src/app.js";

const BASE_URL = process.env.AUTH_SMOKE_BASE_URL || "http://127.0.0.1:4015";
const portFromUrl = Number(new URL(BASE_URL).port || "4015");
const testEmail = `auth.smoke.${Date.now()}@example.com`;
const testPassword = process.env.AUTH_SMOKE_PASSWORD || "StrongPass123!";
const testFullName = "Auth Smoke Tester";

function logStep(label, value) {
  console.log(`${label}=${value}`);
}

async function run() {
  const server = app.listen(portFromUrl, async () => {
    try {
      logStep("base_url", BASE_URL);

      const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          fullName: testFullName
        })
      });
      const registerPayload = await registerRes.json().catch(() => ({}));
      logStep("register_status", registerRes.status);

      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });
      const loginPayload = await loginRes.json().catch(() => ({}));
      logStep("login_status", loginRes.status);

      const token = loginPayload.token || registerPayload.token || "";
      const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const mePayload = await meRes.json().catch(() => ({}));
      logStep("me_status", meRes.status);

      if (!registerRes.ok) {
        logStep("register_error", JSON.stringify(registerPayload));
      }
      if (!loginRes.ok) {
        logStep("login_error", JSON.stringify(loginPayload));
      }
      if (!meRes.ok) {
        logStep("me_error", JSON.stringify(mePayload));
      }

      const success = registerRes.ok && loginRes.ok && meRes.ok;
      logStep("auth_smoke", success ? "PASS" : "FAIL");
      process.exitCode = success ? 0 : 1;
    } catch (error) {
      logStep("fatal_error", error?.message || String(error));
      logStep("auth_smoke", "FAIL");
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });
}

run();
