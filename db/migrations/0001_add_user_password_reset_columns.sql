ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "reset_token" text;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "reset_token_expires" timestamp with time zone;

CREATE INDEX IF NOT EXISTS "users_reset_token_idx"
  ON "users" ("reset_token")
  WHERE "reset_token" IS NOT NULL;
