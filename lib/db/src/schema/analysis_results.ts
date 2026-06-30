import { pgTable, serial, integer, text, real, jsonb, timestamp } from "drizzle-orm/pg-core";

export const analysisResultsTable = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  agentName: text("agent_name").notNull(),
  resultType: text("result_type").notNull(),
  data: jsonb("data").notNull().default({}),
  summary: text("summary"),
  confidence: real("confidence"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AnalysisResult = typeof analysisResultsTable.$inferSelect;
