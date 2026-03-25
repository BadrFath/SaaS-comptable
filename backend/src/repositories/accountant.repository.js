import { db } from "../config/db.js";

async function ensureDemoAccount(accountantId) {
  const query = `
    INSERT INTO accountants (id, email, password_hash, full_name)
    VALUES ($1::uuid, $2, $3, $4)
    ON CONFLICT (id) DO NOTHING
  `;

  await db.query(query, [
    accountantId,
    "demo-accountant@nv-saas.local",
    "not-used-in-demo",
    "Demo Accountant"
  ]);
}

export { ensureDemoAccount };
