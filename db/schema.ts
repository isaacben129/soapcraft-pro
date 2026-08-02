import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, serial, text, real, integer, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";

// --- Database connection (lazy, initialized on first use) ---
function createDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required before using the database");
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
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Recipe ---
export const recipes = pgTable("recipes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  notes: text("notes"),
  method: varchar("method", { length: 2 }),
  createdBy: varchar("created_by", { length: 36 }).notNull(),
  isCurated: integer("is_curated").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Recipe Version ---
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
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Batch ---
export const batches = pgTable("batches", {
  id: varchar("id", { length: 36 }).primaryKey(),
  recipeVersionId: varchar("recipe_version_id", { length: 36 }).notNull().references(() => recipeVersions.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  batchName: text("batch_name").notNull(),
  actualMeasurements: jsonb("actual_measurements").notNull(),
  method: varchar("method", { length: 2 }),
  notes: text("notes"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Cure Observation ---
export const cureObservations = pgTable("cure_observations", {
  id: varchar("id", { length: 36 }).primaryKey(),
  batchId: varchar("batch_id", { length: 36 }).notNull().references(() => batches.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  pH: real("ph"),
  hardness: varchar("hardness", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- Batch Cost ---
export const batchCosts = pgTable("batch_costs", {
  id: varchar("id", { length: 36 }).primaryKey(),
  batchId: varchar("batch_id", { length: 36 }).notNull().references(() => batches.id, { onDelete: "cascade" }),
  ingredientCosts: jsonb("ingredient_costs").notNull(),
  fragranceCost: real("fragrance_cost").notNull().default(0),
  otherCosts: real("other_costs").notNull().default(0),
  totalCost: real("total_cost").notNull(),
  batchYieldBars: real("batch_yield_bars").notNull(),
  costPerBar: real("cost_per_bar").notNull(),
  targetPricePerBar: real("target_price_per_bar").notNull(),
  marginPercent: real("margin_percent").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// --- User ---
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  experienceLevel: varchar("experience_level", { length: 20 }),
  primaryGoal: varchar("primary_goal", { length: 10 }),
  subscriptionTier: varchar("subscription_tier", { length: 10 }),
  trialStartsAt: timestamp("trial_starts_at", { withTimezone: true }),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});
