import { config as loadEnv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Always resolve backend/.env from this file location.
loadEnv({ path: resolve(__dirname, "..", "..", ".env") });
