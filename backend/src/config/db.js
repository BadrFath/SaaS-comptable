import { Pool } from "pg";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const connectionString = process.env.DATABASE_URL || "";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schemaFilePath = resolve(__dirname, "..", "..", "..", "database", "schema.sql");

if (!connectionString) {
  console.warn("DATABASE_URL is not set. Database operations will fail until configured.");
}

const db = new Pool({
  connectionString,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
});

async function verifyDatabaseConnection() {
  if (!connectionString) {
    return;
  }
  await db.query("SELECT 1");
}

async function ensureDatabaseSchema() {
  if (!connectionString) {
    return;
  }

  if (!existsSync(schemaFilePath)) {
    throw new Error(`Schema file not found at ${schemaFilePath}`);
  }

  const schemaSql = readFileSync(schemaFilePath, "utf8").trim();
  if (!schemaSql) {
    throw new Error("Schema file is empty");
  }

  await db.query(schemaSql);
}

export { db, verifyDatabaseConnection, ensureDatabaseSchema };
