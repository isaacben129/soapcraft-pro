/* global console, process, URL */

import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL or POSTGRES_URL is required");
}

const migrationUrl = new URL(
  "../db/migrations/0001_add_user_password_reset_columns.sql",
  import.meta.url
);
const migration = await readFile(migrationUrl, "utf8");
const statements = migration
  .split(/;\s*(?:\r?\n|$)/)
  .map((statement) => statement.trim())
  .filter(Boolean);

const sql = neon(databaseUrl);

for (const statement of statements) {
  await sql.query(statement);
}

console.log("Applied auth database patch.");
