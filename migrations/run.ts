import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { Pool } from "pg";

const root = path.resolve(import.meta.dirname, "..");
const legacyMigration = path.join(root, "0001_init.sql");
const schemaFile = path.join(root, "schema.sql");

function assertDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to run database migrations.");
  }
}

async function readMigration(filePath: string) {
  const source = await fs.readFile(filePath, "utf8");
  if (filePath === legacyMigration && source.includes("\\ir schema.sql")) {
    return source.replace("\\ir schema.sql", await fs.readFile(schemaFile, "utf8"));
  }
  return source;
}

async function main() {
  assertDatabaseUrl();
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const files = (await fs.readdir(root))
      .filter((file) => /^\d+_.+\.sql$/.test(file))
      .sort();

    for (const file of files) {
      const applied = await pool.query("SELECT 1 FROM schema_migrations WHERE version = $1", [file]);
      if (applied.rowCount) {
        continue;
      }

      const sql = await readMigration(path.join(root, file));
      await pool.query("BEGIN");
      try {
        await pool.query(sql);
        await pool.query("INSERT INTO schema_migrations (version) VALUES ($1)", [file]);
        await pool.query("COMMIT");
        console.log(`Applied ${file}`);
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }
    }

    console.log("Database migrations are up to date.");
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
