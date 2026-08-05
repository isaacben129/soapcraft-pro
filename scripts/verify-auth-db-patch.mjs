/* global console, process */

import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL or POSTGRES_URL is required");
}

const sql = neon(databaseUrl);
const rows = await sql.query(
  `select column_name
   from information_schema.columns
   where table_name = $1
     and column_name = any($2)
   order by column_name`,
  ["users", ["reset_token", "reset_token_expires"]]
);
const columns = rows.map((row) => row.column_name);

console.log(columns.join(","));

if (columns.length !== 2) {
  throw new Error("Auth database patch verification failed");
}
