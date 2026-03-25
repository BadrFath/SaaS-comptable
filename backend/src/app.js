import express from "express";
import cors from "cors";
import helmet from "helmet";
import { fpsRouter } from "./routes/fps.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/fps", fpsRouter);

export { app };
