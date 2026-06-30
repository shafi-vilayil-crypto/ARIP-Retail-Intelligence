import { Router, type IRouter } from "express";
import { eq, sql, and, gte } from "drizzle-orm";
import { db, locationsTable } from "@workspace/db";
import { logger } from "../lib/logger";
import {
  ListLocationsQueryParams,
  CreateLocationBody,
  GetLocationParams,
  UpdateLocationParams,
  UpdateLocationBody,
  DeleteLocationParams,
  ScoreLocationParams,
  GetLocationFinancialParams,
  UpdateLocationFinancialParams,
  UpdateLocationFinancialBody,
  GetLocationCompetitorsParams,
} from "@workspace/api-zod";
import { competitorsTable, scoringWeightsTable } from "@workspace/db";

const router: IRouter = Router();

// ─── List locations ───────────────────────────────────────────
router.get("/locations", async (req, res): Promise<void> => {
  const query = ListLocationsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { marketId, state, city, minScore, status } = query.data;

  const conditions = [];
  if (marketId != null) conditions.push(eq(locationsTable.marketId, marketId));
  if (state) conditions.push(eq(locationsTable.state, state));
  if (city) conditions.push(eq(locationsTable.city, city));
  if (minScore != null) conditions.push(gte(locationsTable.overallScore, minScore));
  if (status) conditions.push(eq(locationsTable.status, status as "candidate" | "shortlisted" | "approved" | "rejected"));

  const rows = await db
    .select()
    .from(locationsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(locationsTable.overallScore);

  const formatted = rows.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  res.json(formatted);
});

// ─── Create location ──────────────────────────────────────────
router.post("/locations", async (req, res): Promise<void> => {
  const parsed = CreateLocationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.insert(locationsTable).values({
    name: parsed.data.name,
    address: parsed.data.address ?? null,
    state: parsed.data.state,
    district: parsed.data.district ?? null,
    city: parsed.data.city,
    ward: parsed.data.ward ?? null,
    microMarket: parsed.data.microMarket ?? null,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
    status: (parsed.data.status as "candidate" | "shortlisted" | "approved" | "rejected") ?? "candidate",
    marketId: parsed.data.marketId ?? null,
    notes: parsed.data.notes ?? null,
    population: parsed.data.population ?? null,
    populationDensity: parsed.data.populationDensity ?? null,
    avgMonthlyIncome: parsed.data.avgMonthlyIncome ?? null,
    footfallPerDay: parsed.data.footfallPerDay ?? null,
    deliveryDemandScore: parsed.data.deliveryDemandScore ?? null,
    roadAccess: parsed.data.roadAccess ?? null,
    parkingAvailable: parsed.data.parkingAvailable ?? null,
    publicTransport: parsed.data.publicTransport ?? null,
    walkabilityScore: parsed.data.walkabilityScore ?? null,
    rentalCostPerSqft: parsed.data.rentalCostPerSqft ?? null,
  }).returning();

  res.status(201).json({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
});

// ─── Get location ─────────────────────────────────────────────
router.get("/locations/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetLocationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(locationsTable).where(eq(locationsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Location not found" });
    return;
  }

  const nearby = await db
    .select()
    .from(competitorsTable)
    .where(eq(competitorsTable.city, row.city))
    .limit(10);

  res.json({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    demandProfile: {
      workingProfessionals: row.officeDensityScore ? row.officeDensityScore * 100 : null,
      students: row.studentDensityScore ? row.studentDensityScore * 500 : null,
      deliveryUsers: row.deliveryDemandScore ? row.deliveryDemandScore * 200 : null,
      estimatedDailyFootfall: row.footfallPerDay,
      deliveryPlatforms: "Swiggy, Zomato, Blinkit",
      avgBasketValue: 120,
    },
    financialSimulation: computeFinancials(row),
    scoreBreakdown: {
      populationDensityScore: row.populationDensity ? Math.min(100, (row.populationDensity / 20000) * 100) : null,
      officeDensityScore: row.officeDensityScore,
      studentDensityScore: row.studentDensityScore,
      deliveryDemandScore: row.deliveryDemandScore,
      commercialActivityScore: row.commercialActivityScore,
      accessibilityScore: row.accessibilityScore,
      tourismScore: row.tourismScore,
      nightlifeScore: row.nightlifeScore,
      incomeScore: row.avgMonthlyIncome ? Math.min(100, (row.avgMonthlyIncome / 100000) * 100) : null,
      growthProjectionScore: row.growthScore,
      competitionGapScore: row.competitionScore,
      rentalAffordabilityScore: row.rentalCostPerSqft ? Math.max(0, 100 - (row.rentalCostPerSqft / 3)) : null,
    },
    nearbyCompetitors: nearby.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })),
  });
});

// ─── Update location ──────────────────────────────────────────
router.patch("/locations/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateLocationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateLocationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  const body = parsed.data;
  if (body.name !== undefined) updateData.name = body.name;
  if (body.address !== undefined) updateData.address = body.address;
  if (body.state !== undefined) updateData.state = body.state;
  if (body.district !== undefined) updateData.district = body.district;
  if (body.city !== undefined) updateData.city = body.city;
  if (body.ward !== undefined) updateData.ward = body.ward;
  if (body.microMarket !== undefined) updateData.microMarket = body.microMarket;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.notes !== undefined) updateData.notes = body.notes;
  if (body.population !== undefined) updateData.population = body.population;
  if (body.populationDensity !== undefined) updateData.populationDensity = body.populationDensity;
  if (body.avgMonthlyIncome !== undefined) updateData.avgMonthlyIncome = body.avgMonthlyIncome;
  if (body.footfallPerDay !== undefined) updateData.footfallPerDay = body.footfallPerDay;
  if (body.deliveryDemandScore !== undefined) updateData.deliveryDemandScore = body.deliveryDemandScore;
  if (body.roadAccess !== undefined) updateData.roadAccess = body.roadAccess;
  if (body.parkingAvailable !== undefined) updateData.parkingAvailable = body.parkingAvailable;
  if (body.rentalCostPerSqft !== undefined) updateData.rentalCostPerSqft = body.rentalCostPerSqft;

  const [row] = await db
    .update(locationsTable)
    .set(updateData)
    .where(eq(locationsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Location not found" });
    return;
  }

  res.json({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() });
});

// ─── Delete location ──────────────────────────────────────────
router.delete("/locations/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteLocationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(locationsTable).where(eq(locationsTable.id, params.data.id));
  res.sendStatus(204);
});

// ─── Score location ───────────────────────────────────────────
router.post("/locations/:id/score", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ScoreLocationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [location] = await db.select().from(locationsTable).where(eq(locationsTable.id, params.data.id));
  if (!location) {
    res.status(404).json({ error: "Location not found" });
    return;
  }

  const weights = await db.select().from(scoringWeightsTable).limit(1);
  const w = weights[0] ?? {
    populationDensity: 15, youngPopulation: 10, officeDensity: 12, studentDensity: 10,
    deliveryDemand: 12, commercialActivity: 8, competitionGap: 10, accessibility: 8,
    rentalAffordability: 5, tourism: 5, nightlife: 5, income: 5, growthProjection: 5,
  };

  const nearbyCompetitorCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(competitorsTable)
    .where(eq(competitorsTable.city, location.city));
  const compCount = nearbyCompetitorCount[0]?.count ?? 0;

  const breakdown = {
    populationDensityScore: location.populationDensity ? Math.min(100, (location.populationDensity / 20000) * 100) : 50,
    youngPopulationScore: location.youngPopulationPct ? Math.min(100, (location.youngPopulationPct / 0.4) * 100) : 50,
    officeDensityScore: location.officeDensityScore ?? 50,
    studentDensityScore: location.studentDensityScore ?? 50,
    deliveryDemandScore: location.deliveryDemandScore ?? 50,
    commercialActivityScore: location.commercialActivityScore ?? 50,
    competitionGapScore: Math.max(0, 100 - compCount * 10),
    accessibilityScore: location.accessibilityScore ?? (location.roadAccess ? 70 : 40),
    rentalAffordabilityScore: location.rentalCostPerSqft ? Math.max(0, 100 - (location.rentalCostPerSqft / 3)) : 50,
    tourismScore: location.tourismScore ?? 40,
    nightlifeScore: location.nightlifeScore ?? 40,
    incomeScore: location.avgMonthlyIncome ? Math.min(100, (location.avgMonthlyIncome / 100000) * 100) : 50,
    growthProjectionScore: location.growthScore ?? 50,
  };

  const total = w.populationDensity + w.youngPopulation + w.officeDensity + w.studentDensity +
    w.deliveryDemand + w.commercialActivity + w.competitionGap + w.accessibility +
    w.rentalAffordability + w.tourism + w.nightlife + w.income + w.growthProjection;

  const overallScore = (
    breakdown.populationDensityScore * w.populationDensity +
    breakdown.youngPopulationScore * w.youngPopulation +
    breakdown.officeDensityScore * w.officeDensity +
    breakdown.studentDensityScore * w.studentDensity +
    breakdown.deliveryDemandScore * w.deliveryDemand +
    breakdown.commercialActivityScore * w.commercialActivity +
    breakdown.competitionGapScore * w.competitionGap +
    breakdown.accessibilityScore * w.accessibility +
    breakdown.rentalAffordabilityScore * w.rentalAffordability +
    breakdown.tourismScore * w.tourism +
    breakdown.nightlifeScore * w.nightlife +
    breakdown.incomeScore * w.income +
    breakdown.growthProjectionScore * w.growthProjection
  ) / total;

  const recommendation = overallScore >= 70 ? "expand" : overallScore >= 50 ? "watch" : "avoid";
  const riskLevel = overallScore >= 70 ? "low" : overallScore >= 50 ? "medium" : "high";
  const confidenceLevel = location.populationDensity && location.avgMonthlyIncome ? "high" : "medium";

  await db.update(locationsTable).set({
    overallScore: Math.round(overallScore * 10) / 10,
    demandScore: breakdown.deliveryDemandScore,
    competitionScore: breakdown.competitionGapScore,
    accessibilityScore: breakdown.accessibilityScore,
    growthScore: breakdown.growthProjectionScore,
    recommendation: recommendation as "expand" | "watch" | "avoid" | "under_review",
    riskLevel: riskLevel as "low" | "medium" | "high",
    confidenceLevel,
    competitorCount: compCount,
    updatedAt: new Date(),
  }).where(eq(locationsTable.id, params.data.id));

  req.log.info({ locationId: params.data.id, overallScore }, "Location scored");

  res.json({
    locationId: params.data.id,
    overallScore: Math.round(overallScore * 10) / 10,
    recommendation,
    riskLevel,
    confidenceLevel,
    breakdown,
  });
});

// ─── Get financial simulation ─────────────────────────────────
router.get("/locations/:id/financial", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetLocationFinancialParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(locationsTable).where(eq(locationsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Location not found" });
    return;
  }

  res.json(computeFinancials(row));
});

// ─── Update financial inputs ──────────────────────────────────
router.patch("/locations/:id/financial", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateLocationFinancialParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateLocationFinancialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  const b = parsed.data;
  if (b.capex !== undefined) updateData.capex = b.capex;
  if (b.monthlyRent !== undefined) updateData.monthlyRent = b.monthlyRent;
  if (b.monthlyStaffCost !== undefined) updateData.monthlyStaffCost = b.monthlyStaffCost;
  if (b.monthlyUtilities !== undefined) updateData.monthlyUtilities = b.monthlyUtilities;
  if (b.monthlyInventory !== undefined) updateData.monthlyInventory = b.monthlyInventory;
  if (b.monthlyMarketing !== undefined) updateData.monthlyMarketing = b.monthlyMarketing;
  if (b.estimatedDailyRevenue !== undefined) updateData.estimatedDailyRevenue = b.estimatedDailyRevenue;
  if (b.grossMarginPct !== undefined) updateData.grossMarginPct = b.grossMarginPct;
  if (b.deliveryCommissionPct !== undefined) updateData.deliveryCommissionPct = b.deliveryCommissionPct;

  const [row] = await db.update(locationsTable).set(updateData).where(eq(locationsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Location not found" });
    return;
  }

  res.json(computeFinancials(row));
});

// ─── Get location competitors ─────────────────────────────────
router.get("/locations/:id/competitors", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetLocationCompetitorsParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [location] = await db.select().from(locationsTable).where(eq(locationsTable.id, params.data.id));
  if (!location) {
    res.status(404).json({ error: "Location not found" });
    return;
  }

  const competitors = await db
    .select()
    .from(competitorsTable)
    .where(eq(competitorsTable.city, location.city));

  res.json(competitors.map(c => ({ ...c, createdAt: c.createdAt.toISOString() })));
});

// ─── Financial computation helper ────────────────────────────
function computeFinancials(row: { capex?: number | null; monthlyRent?: number | null; monthlyStaffCost?: number | null; monthlyUtilities?: number | null; monthlyInventory?: number | null; monthlyMarketing?: number | null; estimatedDailyRevenue?: number | null; grossMarginPct?: number | null; deliveryCommissionPct?: number | null }) {
  const capex = row.capex ?? 1500000;
  const monthlyRent = row.monthlyRent ?? 80000;
  const monthlyStaffCost = row.monthlyStaffCost ?? 60000;
  const monthlyUtilities = row.monthlyUtilities ?? 15000;
  const monthlyInventory = row.monthlyInventory ?? 120000;
  const monthlyMarketing = row.monthlyMarketing ?? 20000;
  const monthlyOpex = monthlyRent + monthlyStaffCost + monthlyUtilities + monthlyInventory + monthlyMarketing;
  const dailyRevenue = row.estimatedDailyRevenue ?? 12000;
  const monthlyRevenue = dailyRevenue * 30;
  const grossMarginPct = row.grossMarginPct ?? 45;
  const deliveryCommissionPct = row.deliveryCommissionPct ?? 20;
  const grossProfit = monthlyRevenue * (grossMarginPct / 100);
  const ebitda = grossProfit - monthlyOpex;
  const annualEbitda = ebitda * 12;
  const breakEvenMonths = ebitda > 0 ? Math.round(capex / ebitda) : null;
  const roiPct = annualEbitda > 0 ? Math.round((annualEbitda / capex) * 100) : 0;
  const paybackPeriodMonths = breakEvenMonths;
  const year1Revenue = monthlyRevenue * 12;
  const year3Revenue = year1Revenue * 1.3;
  const year5Revenue = year1Revenue * 1.65;
  return {
    capex, monthlyRent, monthlyStaffCost, monthlyUtilities, monthlyInventory, monthlyMarketing,
    monthlyOpex, monthlyRevenue, grossMarginPct, ebitda, breakEvenMonths,
    roiPct, irrPct: roiPct * 0.8, paybackPeriodMonths,
    year1Revenue, year3Revenue, year5Revenue, deliveryCommissionPct,
  };
}

export default router;
