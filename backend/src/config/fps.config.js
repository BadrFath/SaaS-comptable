const fpsEnv = process.env.FPS_ENV === "prod" ? "prod" : "test";

const endpoints = {
  test: {
    authorization: process.env.FPS_AUTH_TEST_URL || "https://fediamapi-a.minfin.be/sso/oauth2/authorize",
    token: process.env.FPS_TOKEN_TEST_URL || "https://fediamapi-a.minfin.be/sso/oauth2/access_token",
    jwks: process.env.FPS_JWKS_TEST_URL || "https://fediamapi-a.minfin.be/sso/oauth2/connect/jwk_uri"
  },
  prod: {
    authorization: process.env.FPS_AUTH_PROD_URL || "https://fediamapi.minfin.fgov.be/sso/oauth2/authorize",
    token: process.env.FPS_TOKEN_PROD_URL || "https://fediamapi.minfin.fgov.be/sso/oauth2/access_token",
    jwks: process.env.FPS_JWKS_PROD_URL || "https://fediamapi.minfin.fgov.be/sso/oauth2/connect/jwk_uri"
  }
};

const fpsConfig = {
  env: fpsEnv,
  clientId: process.env.FPS_CLIENT_ID || "",
  redirectUri: process.env.FPS_REDIRECT_URI || "",
  scope: process.env.FPS_SCOPE || "openid profile",
  keyId: process.env.FPS_KEY_ID || "",
  privateKeyPem: process.env.FPS_PRIVATE_KEY_PEM || "",
  claimsEcbField: process.env.FPS_CLAIMS_ECB_FIELD || "ecb",
  expectedIssuer: process.env.FPS_EXPECTED_ISSUER || "",
  authUrl: endpoints[fpsEnv].authorization,
  tokenUrl: endpoints[fpsEnv].token,
  jwksUrl: endpoints[fpsEnv].jwks
};

export { fpsConfig };
