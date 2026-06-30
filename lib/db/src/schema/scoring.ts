import { pgTable, serial, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scoringWeightsTable = pgTable("scoring_weights", {
  id: serial("id").primaryKey(),
  populationDensity: real("population_density").notNull().default(15),
  youngPopulation: real("young_population").notNull().default(10),
  officeDensity: real("office_density").notNull().default(12),
  studentDensity: real("student_density").notNull().default(10),
  deliveryDemand: real("delivery_demand").notNull().default(12),
  commercialActivity: real("commercial_activity").notNull().default(8),
  competitionGap: real("competition_gap").notNull().default(10),
  accessibility: real("accessibility").notNull().default(8),
  rentalAffordability: real("rental_affordability").notNull().default(5),
  tourism: real("tourism").notNull().default(5),
  nightlife: real("nightlife").notNull().default(5),
  income: real("income").notNull().default(5),
  growthProjection: real("growth_projection").notNull().default(5),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertScoringWeightsSchema = createInsertSchema(scoringWeightsTable).omit({ id: true, updatedAt: true });
export type InsertScoringWeights = z.infer<typeof insertScoringWeightsSchema>;
export type ScoringWeights = typeof scoringWeightsTable.$inferSelect;
