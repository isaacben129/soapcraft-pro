import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import {
  pgTable,
  serial,
  text,
  real,
  integer,
  timestamp,
  jsonb,
  varchar,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

// --- Database connection (lazy, initialized on first use) ---
function createDb() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL or POSTGRES_URL is required before using the database"
    );
  }

  return drizzle(neon(databaseUrl));
}

let dbClient: ReturnType<typeof createDb> | null = null;

export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop) {
    dbClient ??= createDb();
    const value = Reflect.get(dbClient, prop);
    return typeof value === "function" ? value.bind(dbClient) : value;
  },
});

// ============================================================================
// R1.3: Correct relational model and migrations
// Added: userId ownership, currentVersionId, planned snapshot,
// normalized actual measurement line items, Making Session/steps,
// ingredient cost records, batch cost revisions, activity events,
// subscription provider projection, archive fields, safe FK behavior.
// ============================================================================

// --- Ingredient ---
export const ingredients = pgTable("ingredients", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  nameShort: text("name_short").notNull(),
  sapValueNaOH: real("sap_value_naoh").notNull(),
  sapValueKOH: real("sap_value_koh").notNull(),
  hardnessFactor: real("hardness_factor").notNull().default(0),
  latherFactor: real("lather_factor").notNull().default(0),
  moisturizingFactor: real("moisturizing_factor").notNull().default(0),
  ifraCategory: text("ifra_category"),
  maxUsagePercent: real("max_usage_percent"),
  source: text("source").notNull().default("community"),
  createdBy: varchar("created_by", { length: 36 }).notNull(),
  isPrivate: boolean("is_private").notNull().default(false),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- User ---
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  passwordHash: text("password_hash"),
  experienceLevel: varchar("experience_level", { length: 20 }),
  primaryGoal: varchar("primary_goal", { length: 10 }),
  subscriptionTier: varchar("subscription_tier", { length: 10 }),
  trialStartsAt: timestamp("trial_starts_at", { withTimezone: true }),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Recipe ---
export const recipes = pgTable("recipes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  notes: text("notes"),
  method: varchar("method", { length: 2 }),
  createdBy: varchar("created_by", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  isCurated: integer("is_curated").notNull().default(0),
  currentVersionId: varchar("current_version_id", { length: 36 }).references(() => recipeVersions.id, { onDelete: "set null" }),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Recipe Version (immutable) ---
export const recipeVersions = pgTable("recipe_versions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  recipeId: varchar("recipe_id", { length: 36 }).notNull().references(() => recipes.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  name: text("name").notNull(),
  notes: text("notes"),
  method: varchar("method", { length: 2 }),
  oilBlend: jsonb("oil_blend").notNull(),
  superfatPercent: real("superfat_percent").notNull(),
  lyeConcentrationPercent: real("lye_concentration_percent").notNull(),
  waterToLyeRatio: real("water_to_lye_ratio").notNull(),
  calculatedLyeNaOH: real("calculated_lye_naoh").notNull(),
  calculatedLyeKOH: real("calculated_lye_koh").notNull(),
  calculatedWater: real("calculated_water").notNull(),
  calculatedFragranceLoad: real("calculated_fragrance_load").notNull(),
  propertyRanges: jsonb("property_ranges"),
  warnings: jsonb("warnings").notNull().default([]),
  datasetRevision: varchar("dataset_revision", { length: 20 }).notNull().default("1.0.0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Batch ---
export const batches = pgTable("batches", {
  id: varchar("id", { length: 36 }).primaryKey(),
  recipeVersionId: varchar("recipe_version_id", { length: 36 }).notNull().references(() => recipeVersions.id, { onDelete: "restrict" }),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  batchName: text("batch_name").notNull(),
  // Planned snapshot copied from the recipe version at batch creation time
  plannedSnapshot: jsonb("planned_snapshot").notNull(),
  // Normalized actual measurement line items (replaces the old actualMeasurements JSON blob)
  notes: text("notes"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Actual Measurement Line Item (normalized) ---
export const actualMeasurementLineItems = pgTable("actual_measurement_line_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  batchId: varchar("batch_id", { length: 36 }).notNull().references(() => batches.id, { onDelete: "cascade" }),
  ingredientId: varchar("ingredient_id", { length: 36 }).references(() => ingredients.id, { onDelete: "set null" }),
  oilId: varchar("oil_id", { length: 36 }),
  plannedWeight: real("planned_weight"),
  actualWeight: real("actual_weight"),
  unit: varchar("unit", { length: 20 }).notNull().default("g"),
  role: varchar("role", { length: 20 }).notNull(), // oil, lye, water, fragrance, additive
  plannedBy: varchar("planned_by", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  observedAt: timestamp("observed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Making Session ---
export const makingSessions = pgTable("making_sessions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  batchId: varchar("batch_id", { length: 36 }).notNull().references(() => batches.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, paused, complete
  currentStep: integer("current_step").notNull().default(0),
  timerStartAt: timestamp("timer_start_at", { withTimezone: true }),
  timerElapsedSeconds: integer("timer_elapsed_seconds").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Making Step ---
export const makingSteps = pgTable("making_steps", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sessionId: varchar("session_id", { length: 36 }).notNull().references(() => makingSessions.id, { onDelete: "cascade" }),
  stepIndex: integer("step_index").notNull(),
  name: text("name").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, in_progress, complete
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Cure Observation ---
export const cureObservations = pgTable("cure_observations", {
  id: varchar("id", { length: 36 }).primaryKey(),
  batchId: varchar("batch_id", { length: 36 }).notNull().references(() => batches.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
  pH: real("ph"),
  hardness: varchar("hardness", { length: 50 }),
  traceState: varchar("trace_state", { length: 20 }), // thin, medium, thick
  notes: text("notes"),
  createdBy: varchar("created_by", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Ingredient Cost Record ---
export const ingredientCostRecords = pgTable("ingredient_cost_records", {
  id: varchar("id", { length: 36 }).primaryKey(),
  ingredientId: varchar("ingredient_id", { length: 36 }).notNull().references(() => ingredients.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  costPerUnit: real("cost_per_unit").notNull(),
  unit: varchar("unit", { length: 20 }).notNull(), // g, oz, lb, kg
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  source: text("source"), // supplier name or URL
  effectiveDate: timestamp("effective_date", { withTimezone: true }).notNull(),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Batch Cost ---
export const batchCosts = pgTable("batch_costs", {
  id: varchar("id", { length: 36 }).primaryKey(),
  batchId: varchar("batch_id", { length: 36 }).notNull().references(() => batches.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  ingredientCosts: jsonb("ingredient_costs").notNull(), // array of { ingredientId, costPerUnit, quantity, total }
  fragranceCost: real("fragrance_cost").notNull().default(0),
  otherCosts: real("other_costs").notNull().default(0),
  totalCost: real("total_cost").notNull(),
  batchYieldBars: real("batch_yield_bars").notNull(),
  costPerBar: real("cost_per_bar").notNull(),
  targetPricePerBar: real("target_price_per_bar").notNull(),
  marginPercent: real("margin_percent").notNull(),
  costBasisRevision: integer("cost_basis_revision").notNull().default(1),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Activity Event ---
export const activityEvents = pgTable("activity_events", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  entityType: varchar("entity_type", { length: 30 }).notNull(), // recipe, batch, making_session, cure_observation, cost
  entityId: varchar("entity_id", { length: 36 }).notNull(),
  action: varchar("action", { length: 30 }).notNull(), // created, updated, deleted, started, completed, saved
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Subscription (Dodo provider projection) ---
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  dodoCustomerId: varchar("dodo_customer_id", { length: 100 }),
  dodoSubscriptionId: varchar("dodo_subscription_id", { length: 100 }),
  dodoPriceId: varchar("dodo_price_id", { length: 100 }),
  tier: varchar("tier", { length: 20 }).notNull().default("free"), // free, pro
  status: varchar("status", { length: 20 }).notNull().default("free"), // free, trialing, active, past_due, cancel_at_period_end, canceled, payment_pending
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  lastWebhookEventId: varchar("last_webhook_event_id", { length: 100 }),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});
