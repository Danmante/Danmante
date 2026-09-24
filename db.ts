import { Pool } from "pg";

let pool: Pool | null = null;

function getPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 1500,
      idleTimeoutMillis: 30000,
      max: 10,
    });
  }

  return pool;
}

export type DatabaseCheck = "ok" | "not_configured" | "unavailable";

export async function checkDatabase(): Promise<DatabaseCheck> {
  const database = getPool();
  if (!database) {
    return "not_configured";
  }

  try {
    await database.query("SELECT 1");
    return "ok";
  } catch {
    return "unavailable";
  }
}

export async function closeDatabase() {
  if (!pool) {
    return;
  }
  await pool.end();
  pool = null;
}

export function getDatabasePool() {
  return getPool();
}
