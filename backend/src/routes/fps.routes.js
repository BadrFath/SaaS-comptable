import { Router } from "express";
import { buildAuthorizationUrl, exchangeAuthorizationCode } from "../services/fpsAuth.service.js";
import { listMandantsSummary } from "../repositories/mandant.repository.js";

const fpsRouter = Router();

fpsRouter.post("/connect/start", (req, res) => {
  try {
    const { ecbNumber } = req.body;
    if (!/^\d{10}$/.test(String(ecbNumber || ""))) {
      return res.status(400).json({ message: "ecbNumber must contain exactly 10 digits" });
    }

    const authorizationUrl = buildAuthorizationUrl(String(ecbNumber));
    return res.json({ authorizationUrl });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

fpsRouter.get("/connect/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) {
      return res.status(400).json({ message: "Missing code or state" });
    }

    await exchangeAuthorizationCode({ code: String(code), state: String(state) });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/connect/success`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const reason = encodeURIComponent(error.message || "Unexpected callback error");
    return res.redirect(`${frontendUrl}/connect/error?reason=${reason}`);
  }
});

fpsRouter.get("/mandants", async (_req, res) => {
  try {
    const rows = await listMandantsSummary();
    return res.json({ data: rows });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

fpsRouter.post("/tokens/refresh", async (req, res) => {
  try {
    const { enqueueBulkRefresh, enqueueRefreshForMandant } = await import("../workers/queues.js");
    const { ecbNumber } = req.body || {};

    if (ecbNumber) {
      if (!/^\d{10}$/.test(String(ecbNumber))) {
        return res.status(400).json({ message: "ecbNumber must contain exactly 10 digits" });
      }
      await enqueueRefreshForMandant(String(ecbNumber));
      return res.status(202).json({ message: "Refresh job enqueued", scope: "single" });
    }

    await enqueueBulkRefresh();
    return res.status(202).json({ message: "Refresh job enqueued", scope: "all" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export { fpsRouter };
