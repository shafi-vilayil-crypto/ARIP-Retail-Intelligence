import { pgTable, serial, text, real, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const competitorTypeEnum = pgEnum("competitor_type", [
  "milma_booth", "juice_shop", "tea_shop", "bubble_tea", "cafe",
  "fresh_juice_chain", "ice_cream_chain", "convenience_store",
  "mall_food_court", "petrol_station", "other"
]);

export const priceRangeEnum = pgEnum("price_range", ["budget", "mid", "premium"]);

export const competitorsTable = pgTable("competitors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand"),
  type: competitorTypeEnum("type").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  address: text("address"),
  priceRange: priceRangeEnum("price_range"),
  avgRating: real("avg_rating"),
  reviewCount: integer("review_count"),
  deliveryAvailable: boolean("delivery_available"),
  operatingHours: text("operating_hours"),
  strengths: text("strengths"),
  weaknesses: text("weaknesses"),
  marketShare: real("market_share"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCompetitorSchema = createInsertSchema(competitorsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Competitor = typeof competitorsTable.$inferSelect;
