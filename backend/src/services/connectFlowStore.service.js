const loginFlows = new Map();

function saveLoginFlow(state, flowData) {
  loginFlows.set(state, { ...flowData, createdAt: Date.now() });
}

function takeLoginFlow(state) {
  const flow = loginFlows.get(state);
  loginFlows.delete(state);
  return flow;
}

export { saveLoginFlow, takeLoginFlow };
