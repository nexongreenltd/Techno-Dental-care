import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool, types } = pg;

// Return DATE columns as plain "YYYY-MM-DD" strings instead of JS Date objects
// (avoids UTC-midnight timezone shift when the server and client are in different zones)
types.setTypeParser(1082, (val: string) => val);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error", err);
});
