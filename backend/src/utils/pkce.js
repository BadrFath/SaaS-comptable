import crypto from "crypto";

function toBase64Url(input) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function generatePkcePair() {
  const verifierRaw = crypto.randomBytes(32);
  const codeVerifier = toBase64Url(verifierRaw);
  const challenge = crypto.createHash("sha256").update(codeVerifier).digest();
  const codeChallenge = toBase64Url(challenge);

  return {
    codeVerifier,
    codeChallenge
  };
}

function randomOpaque(size = 32) {
  return toBase64Url(crypto.randomBytes(size));
}

export { generatePkcePair, randomOpaque };
