import { pgTable, serial, text, real, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const marketLevelEnum = pgEnum("market_level", ["country", "state", "district", "city", "town", "ward", "micro_market"]);

export const marketsTable = pgTable("markets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  level: marketLevelEnum("level").notNull(),
  state: text("state").notNull(),
  district: text("district"),
  city: text("city"),
  parentId: integer("parent_id"),
  population: real("population"),
  populationDensity: real("population_density"),
  avgIncome: real("avg_income"),
  urbanizationRate: real("urbanization_rate"),
  growthRate: real("growth_rate"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMarketSchema = createInsertSchema(marketsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMarket = z.infer<typeof insertMarketSchema>;
export type Market = typeof marketsTable.$inferSelect;
