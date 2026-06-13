import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

async function setup() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌  DATABASE_URL is not set in .env");
    process.exit(1);
  }

  // Parse the DB name from the URL so we can create it if missing
  const dbName = new URL(url).pathname.slice(1); // e.g. "techno_dental"

  // Connect to the default 'postgres' database first to create the target DB
  const adminUrl = url.replace(`/${dbName}`, "/postgres");
  const adminClient = new Client({ connectionString: adminUrl });

  try {
    await adminClient.connect();
    const exists = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName],
    );
    if (!exists.rows.length) {
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅  Database "${dbName}" created`);
    } else {
      console.log(`ℹ️   Database "${dbName}" already exists`);
    }
  } catch (err: unknown) {
    console.warn("⚠️  Could not auto-create database:", (err as Error).message);
    console.warn("    Make sure the database exists before running schema.");
  } finally {
    await adminClient.end().catch(() => {});
  }

  // Now connect to the target database and run the schema
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");
    await client.query(schema);
    console.log("✅  Schema applied successfully");
    console.log("\nDefault admin credentials:");
    console.log("   Email:    admin@technodental.com");
    console.log("   Password: Admin@1234\n");
  } catch (err: unknown) {
    console.error("❌  Schema error:", (err as Error).message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setup();
