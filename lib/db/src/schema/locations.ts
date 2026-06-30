import { pgTable, serial, text, real, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const locationStatusEnum = pgEnum("location_status", ["candidate", "shortlisted", "approved", "rejected"]);
export const recommendationEnum = pgEnum("recommendation", ["expand", "watch", "avoid", "under_review"]);
export const riskLevelEnum = pgEnum("risk_level", ["low", "medium", "high"]);

export const locationsTable = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  state: text("state").notNull(),
  district: text("district"),
  city: text("city").notNull(),
  ward: text("ward"),
  microMarket: text("micro_market"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  status: locationStatusEnum("status").notNull().default("candidate"),
  marketId: integer("market_id"),
  overallScore: real("overall_score").notNull().default(0),
  demandScore: real("demand_score"),
  competitionScore: real("competition_score"),
  logisticsScore: real("logistics_score"),
  financialScore: real("financial_score"),
  accessibilityScore: real("accessibility_score"),
  growthScore: real("growth_score"),
  recommendation: recommendationEnum("recommendation").notNull().default("under_review"),
  riskLevel: riskLevelEnum("risk_level").notNull().default("medium"),
  confidenceLevel: text("confidence_level").notNull().default("medium"),
  notes: text("notes"),
  // Demand inputs
  population: real("population"),
  populationDensity: real("population_density"),
  avgMonthlyIncome: real("avg_monthly_income"),
  footfallPerDay: real("footfall_per_day"),
  deliveryDemandScore: real("delivery_demand_score"),
  roadAccess: boolean("road_access"),
  parkingAvailable: boolean("parking_available"),
  publicTransport: boolean("public_transport"),
  walkabilityScore: real("walkability_score"),
  rentalCostPerSqft: real("rental_cost_per_sqft"),
  // Financial inputs
  capex: real("capex"),
  monthlyRent: real("monthly_rent"),
  monthlyStaffCost: real("monthly_staff_cost"),
  monthlyUtilities: real("monthly_utilities"),
  monthlyInventory: real("monthly_inventory"),
  monthlyMarketing: real("monthly_marketing"),
  estimatedDailyRevenue: real("estimated_daily_revenue"),
  grossMarginPct: real("gross_margin_pct"),
  deliveryCommissionPct: real("delivery_commission_pct"),
  // Young population / office / student density inputs
  youngPopulationPct: real("young_population_pct"),
  officeDensityScore: real("office_density_score"),
  studentDensityScore: real("student_density_score"),
  commercialActivityScore: real("commercial_activity_score"),
  tourismScore: real("tourism_score"),
  nightlifeScore: real("nightlife_score"),
  competitorCount: integer("competitor_count"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLocationSchema = createInsertSchema(locationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locationsTable.$inferSelect;
