const mandants = new Map();
const loginFlows = new Map();

function saveLoginFlow(state, flowData) {
  loginFlows.set(state, { ...flowData, createdAt: Date.now() });
}

function takeLoginFlow(state) {
  const flow = loginFlows.get(state);
  loginFlows.delete(state);
  return flow;
}

function saveMandantTokens(mandant) {
  mandants.set(mandant.ecbNumber, mandant);
}

function listMandants() {
  return Array.from(mandants.values()).map((item) => ({
    ecbNumber: item.ecbNumber,
    companyName: item.companyName || "Unknown",
    status: item.status,
    tokenExpiry: item.tokenExpiry,
    consentGivenAt: item.consentGivenAt,
    lastSyncAt: item.lastSyncAt || null
  }));
}

export { saveLoginFlow, takeLoginFlow, saveMandantTokens, listMandants };
