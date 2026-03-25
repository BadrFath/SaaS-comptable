import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "";

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

export { db, verifyDatabaseConnection };
