import { pgTable, serial, text, real, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const analysisStatusEnum = pgEnum("analysis_status", [
  "idle", "running", "completed", "failed"
]);

export const companiesTable = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull().default("Beverage Retail"),
  headquarters: text("headquarters").notNull(),
  currentStates: jsonb("current_states").notNull().default([]),
  businessModel: text("business_model").notNull().default("Owned"),
  products: jsonb("products").notNull().default([]),
  competitors: jsonb("competitors").notNull().default([]),
  expansionGoal: text("expansion_goal").notNull().default("National"),
  expansionScope: text("expansion_scope").notNull().default("India"),
  expansionStates: jsonb("expansion_states").notNull().default([]),
  timeline: text("timeline").notNull().default("3 Years"),
  budget: text("budget"),
  analysisStatus: analysisStatusEnum("analysis_status").notNull().default("idle"),
  analysisProgress: real("analysis_progress").notNull().default(0),
  analysisLog: jsonb("analysis_log").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companiesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companiesTable.$inferSelect;
