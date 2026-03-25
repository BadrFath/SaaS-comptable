import crypto from "crypto";
import { fpsConfig } from "../config/fps.config.js";

let jwksCache = {
  fetchedAt: 0,
  keys: []
};

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64");
}

function parseJwtParts(jwt) {
  const parts = String(jwt || "").split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format");
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  const header = JSON.parse(decodeBase64Url(headerB64).toString("utf8"));
  const payload = JSON.parse(decodeBase64Url(payloadB64).toString("utf8"));
  const signature = decodeBase64Url(signatureB64);

  return {
    header,
    payload,
    signature,
    signingInput: `${headerB64}.${payloadB64}`
  };
}

async function fetchJwks() {
  const now = Date.now();
  const cacheTtlMs = 10 * 60 * 1000;

  if (jwksCache.keys.length > 0 && now - jwksCache.fetchedAt < cacheTtlMs) {
    return jwksCache.keys;
  }

  if (!fpsConfig.jwksUrl) {
    throw new Error("FPS JWKS URL is missing");
  }

  const response = await fetch(fpsConfig.jwksUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch FPS JWKS (${response.status})`);
  }

  const payload = await response.json();
  const keys = Array.isArray(payload.keys) ? payload.keys : [];
  if (keys.length === 0) {
    throw new Error("FPS JWKS response does not contain keys");
  }

  jwksCache = {
    fetchedAt: now,
    keys
  };

  return keys;
}

function validateStandardClaims({ payload, nonce }) {
  const nowSec = Math.floor(Date.now() / 1000);

  if (!payload.exp || Number(payload.exp) <= nowSec) {
    throw new Error("ID token is expired");
  }

  if (payload.iat && Number(payload.iat) > nowSec + 60) {
    throw new Error("ID token iat is in the future");
  }

  if (!payload.aud) {
    throw new Error("ID token aud is missing");
  }

  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.includes(fpsConfig.clientId)) {
    throw new Error("ID token aud does not match client_id");
  }

  if (fpsConfig.expectedIssuer && payload.iss !== fpsConfig.expectedIssuer) {
    throw new Error("ID token issuer mismatch");
  }

  if (!nonce || payload.nonce !== nonce) {
    throw new Error("ID token nonce mismatch");
  }
}

async function verifyIdToken(idToken, expectedNonce) {
  if (!idToken) {
    throw new Error("ID token is missing");
  }

  const { header, payload, signature, signingInput } = parseJwtParts(idToken);

  if (header.alg !== "RS256") {
    throw new Error("Unsupported ID token alg (expected RS256)");
  }

  validateStandardClaims({ payload, nonce: expectedNonce });

  const jwks = await fetchJwks();
  const jwk = jwks.find((item) => item.kid === header.kid && item.kty === "RSA");
  if (!jwk) {
    throw new Error("No matching FPS JWK found for ID token kid");
  }

  const publicKey = crypto.createPublicKey({ key: jwk, format: "jwk" });
  const verified = crypto.verify(
    "RSA-SHA256",
    Buffer.from(signingInput, "utf8"),
    publicKey,
    signature
  );

  if (!verified) {
    throw new Error("Invalid ID token signature");
  }

  return payload;
}

export { verifyIdToken };
