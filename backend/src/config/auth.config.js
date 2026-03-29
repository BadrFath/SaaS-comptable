const DEFAULT_AUTH_TTL_SECONDS = 8 * 60 * 60;
const DEFAULT_BCRYPT_ROUNDS = 12;

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
}

const authConfig = {
  jwtSecret: process.env.AUTH_JWT_SECRET || process.env.TOKEN_ENCRYPTION_KEY || "",
  tokenTtlSeconds: parsePositiveInteger(process.env.AUTH_TOKEN_TTL_SECONDS, DEFAULT_AUTH_TTL_SECONDS),
  bcryptRounds: parsePositiveInteger(process.env.AUTH_BCRYPT_ROUNDS, DEFAULT_BCRYPT_ROUNDS),
  tokenIssuer: process.env.AUTH_TOKEN_ISSUER || "nv-saas-backend",
  demoEmail: String(process.env.AUTH_DEMO_EMAIL || "demo-accountant@nv-saas.local").toLowerCase(),
  demoPassword: process.env.AUTH_DEMO_PASSWORD || "ChangeMe123!",
  demoFullName: process.env.AUTH_DEMO_FULL_NAME || "Demo Accountant"
};

export { authConfig };
