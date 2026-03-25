import crypto from "crypto";

function base64UrlEncodeJson(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function signRs256(data, privateKeyPem) {
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(data);
  signer.end();
  return signer.sign(privateKeyPem, "base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function buildClientAssertion({ clientId, audience, keyId, privateKeyPem }) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
    kid: keyId
  };

  const payload = {
    iss: clientId,
    sub: clientId,
    aud: audience,
    exp: now + 1800,
    iat: now,
    jti: crypto.randomUUID()
  };

  const encodedHeader = base64UrlEncodeJson(header);
  const encodedPayload = base64UrlEncodeJson(payload);
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = signRs256(unsignedToken, privateKeyPem);

  return `${unsignedToken}.${signature}`;
}

export { buildClientAssertion };
