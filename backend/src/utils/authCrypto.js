import crypto from "crypto";

function encodeBase64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value) {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = padding === 0 ? normalized : `${normalized}${"=".repeat(4 - padding)}`;
  return Buffer.from(padded, "base64");
}

function hashPassword(password) {
  const normalized = String(password || "");
  if (normalized.length < 8) {
    throw new Error("Password must contain at least 8 characters");
  }

  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(normalized, salt, 64);
  return `scrypt$${encodeBase64Url(salt)}$${encodeBase64Url(hash)}`;
}

function verifyPassword(password, storedHash) {
  const normalizedHash = String(storedHash || "");
  if (!normalizedHash.startsWith("scrypt$")) {
    return false;
  }

  const parts = normalizedHash.split("$");
  if (parts.length !== 3) {
    return false;
  }

  const [, saltEncoded, hashEncoded] = parts;
  const salt = decodeBase64Url(saltEncoded);
  const expectedHash = decodeBase64Url(hashEncoded);
  const computedHash = crypto.scryptSync(String(password || ""), salt, expectedHash.length);

  if (computedHash.length !== expectedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(computedHash, expectedHash);
}

function signSessionToken({ accountantId, email, fullName, secret, expiresInSeconds }) {
  if (!secret) {
    throw new Error("AUTH_JWT_SECRET or TOKEN_ENCRYPTION_KEY must be configured");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: accountantId,
    email,
    name: fullName,
    iat: now,
    exp: now + expiresInSeconds
  };

  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${signingInput}.${signature}`;
}

function verifySessionToken(token, secret) {
  if (!secret) {
    throw new Error("AUTH_JWT_SECRET or TOKEN_ENCRYPTION_KEY must be configured");
  }

  const parts = String(token || "").split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid session token format");
  }

  const [encodedHeader, encodedPayload, receivedSignature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  const receivedBuffer = Buffer.from(receivedSignature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  if (receivedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)) {
    throw new Error("Invalid session token signature");
  }

  const payload = JSON.parse(decodeBase64Url(encodedPayload).toString("utf8"));
  if (!payload.sub || !payload.exp) {
    throw new Error("Invalid session token payload");
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) {
    throw new Error("Session token expired");
  }

  return payload;
}

export { hashPassword, verifyPassword, signSessionToken, verifySessionToken };
