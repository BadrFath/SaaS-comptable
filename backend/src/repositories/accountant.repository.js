import { db } from "../config/db.js";

async function ensureDemoAccount({ accountantId, email, passwordHash, fullName }) {
  const query = `
    INSERT INTO accountants (id, email, password_hash, full_name)
    VALUES ($1::uuid, $2, $3, $4)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      password_hash = EXCLUDED.password_hash,
      full_name = EXCLUDED.full_name
  `;

  await db.query(query, [
    accountantId,
    String(email || "").toLowerCase(),
    passwordHash,
    fullName
  ]);
}

async function createAccountant({ email, passwordHash, fullName }) {
  const query = `
    INSERT INTO accountants (email, password_hash, full_name)
    VALUES ($1, $2, $3)
    RETURNING id, email, full_name, created_at
  `;

  const result = await db.query(query, [String(email || "").toLowerCase(), passwordHash, fullName]);
  return result.rows[0];
}

async function findAccountantByEmail(email) {
  const query = `
    SELECT id, email, password_hash, full_name, created_at
    FROM accountants
    WHERE email = $1
    LIMIT 1
  `;

  const result = await db.query(query, [String(email || "").toLowerCase()]);
  return result.rows[0] || null;
}

async function findAccountantById(accountantId) {
  const query = `
    SELECT id, email, password_hash, full_name, created_at
    FROM accountants
    WHERE id = $1::uuid
    LIMIT 1
  `;

  const result = await db.query(query, [accountantId]);
  return result.rows[0] || null;
}

export { ensureDemoAccount, createAccountant, findAccountantByEmail, findAccountantById };
