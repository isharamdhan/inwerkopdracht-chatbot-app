import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import mysql from "mysql2/promise";

const migrationsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "migrations",
);

async function connect(retries = 10) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await mysql.createConnection({
        host: process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT ?? 3306),
        user: process.env.DB_USER ?? "chatbot",
        password: process.env.DB_PASSWORD ?? "chatbot",
        database: process.env.DB_NAME ?? "chatbot",
        multipleStatements: true,
      });
    } catch (err) {
      if (attempt >= retries) throw err;
      console.log(`DB not ready (attempt ${attempt}/${retries}), retrying…`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

async function run() {
  const db = await connect();

  await db.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  );

  let files = [];
  try {
    files = (await readdir(migrationsDir))
      .filter((f) => f.endsWith(".sql"))
      .sort();
  } catch {
    files = [];
  }

  const [applied] = await db.query("SELECT name FROM schema_migrations");
  const done = new Set(applied.map((r) => r.name));

  const pending = files.filter((f) => !done.has(f));
  if (pending.length === 0) {
    console.log("Migrations up to date.");
    await db.end();
    return;
  }

  for (const file of pending) {
    const sql = await readFile(join(migrationsDir, file), "utf8");
    console.log(`Applying ${file}…`);
    await db.query(sql);
    await db.query("INSERT INTO schema_migrations (name) VALUES (?)", [file]);
  }

  console.log(`Applied ${pending.length} migration(s).`);
  await db.end();
}

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
