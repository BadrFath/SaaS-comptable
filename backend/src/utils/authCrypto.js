import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function hashPassword(password, rounds = 12) {
  const normalized = String(password || "");
  if (normalized.length < 8) {
    throw new Error("Password must contain at least 8 characters");
  }
  return bcrypt.hash(normalized, rounds);
}

async function verifyPassword(password, storedHash) {
  const normalizedHash = String(storedHash || "");
  if (!normalizedHash) {
    return false;
  }
  return bcrypt.compare(String(password || ""), normalizedHash);
}

function signSessionToken({ accountantId, email, fullName, secret, expiresInSeconds, issuer }) {
  if (!secret) {
    throw new Error("AUTH_JWT_SECRET or TOKEN_ENCRYPTION_KEY must be configured");
  }

  return jwt.sign(
    {
      email,
      name: fullName
    },
    secret,
    {
      subject: String(accountantId),
      expiresIn: Number(expiresInSeconds),
      issuer: issuer || "nv-saas-backend"
    }
  );
}

function verifySessionToken(token, secret, issuer) {
  if (!secret) {
    throw new Error("AUTH_JWT_SECRET or TOKEN_ENCRYPTION_KEY must be configured");
  }

  const decoded = jwt.verify(String(token || ""), secret, {
    issuer: issuer || "nv-saas-backend"
  });

  if (!decoded.sub) {
    throw new Error("Invalid session token payload");
  }

  return decoded;
}

export { hashPassword, verifyPassword, signSessionToken, verifySessionToken };
