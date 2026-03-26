import express from "express";
import cors from "cors";
import helmet from "helmet";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fpsRouter } from "./routes/fps.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const frontendDistPath = resolve(__dirname, "..", "..", "frontend", "dist");
const hasFrontendBuild = existsSync(frontendDistPath);
const jwksPath = resolve(__dirname, "..", "keys", "jwks.json");

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/.well-known/jwks.json", (_req, res) => {
  if (!existsSync(jwksPath)) {
    return res.status(500).json({ message: "JWKS file not found on server" });
  }

  res.type("application/jwk-set+json");
  return res.sendFile(jwksPath);
});

app.use("/api/fps", fpsRouter);

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }
    return res.sendFile(resolve(frontendDistPath, "index.html"));
  });
}

export { app };
