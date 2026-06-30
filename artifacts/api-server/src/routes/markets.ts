import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, marketsTable, locationsTable } from "@workspace/db";
import {
  ListMarketsQueryParams,
  CreateMarketBody,
  GetMarketParams,
  UpdateMarketParams,
  UpdateMarketBody,
  DeleteMarketParams,
  GetMarketRankingParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/markets", async (req, res): Promise<void> => {
  const query = ListMarketsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { level, parentId } = query.data;

  const conditions = [];
  if (level) conditions.push(eq(marketsTable.level, level as "country" | "state" | "district" | "city" | "town" | "ward" | "micro_market"));
  if (parentId != null) conditions.push(eq(marketsTable.parentId, parentId));

  const rows = await db
    .select()
    .from(marketsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(marketsTable.level, marketsTable.name);

  const withCounts = await Promise.all(rows.map(async (market) => {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(locationsTable)
      .where(eq(locationsTable.marketId, market.id));
    const avgScoreResult = await db
      .select({ avg: sql<number>`avg(overall_score)::numeric(5,1)` })
      .from(locationsTable)
      .where(eq(locationsTable.marketId, market.id));
    return {
      ...market,
      locationCount: count ?? 0,
      avgScore: avgScoreResult[0]?.avg ? Number(avgScoreResult[0].avg) : null,
      createdAt: market.createdAt.toISOString(),
    };
  }));

  res.json(withCounts);
});

router.post("/markets", async (req, res): Promise<void> => {
  const parsed = CreateMarketBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.insert(marketsTable).values({
    name: parsed.data.name,
    level: parsed.data.level as "country" | "state" | "district" | "city" | "town" | "ward" | "micro_market",
    state: parsed.data.state,
    district: parsed.data.district ?? null,
    city: parsed.data.city ?? null,
    parentId: parsed.data.parentId ?? null,
    population: parsed.data.population ?? null,
    populationDensity: parsed.data.populationDensity ?? null,
    avgIncome: parsed.data.avgIncome ?? null,
    urbanizationRate: parsed.data.urbanizationRate ?? null,
    growthRate: parsed.data.growthRate ?? null,
    notes: parsed.data.notes ?? null,
  }).returning();

  res.status(201).json({ ...row, locationCount: 0, avgScore: null, createdAt: row.createdAt.toISOString() });
});

router.get("/markets/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetMarketParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(marketsTable).where(eq(marketsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Market not found" });
    return;
  }

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(locationsTable).where(eq(locationsTable.marketId, row.id));
  const avgScoreResult = await db.select({ avg: sql<number>`avg(overall_score)::numeric(5,1)` }).from(locationsTable).where(eq(locationsTable.marketId, row.id));

  res.json({
    ...row,
    locationCount: count ?? 0,
    avgScore: avgScoreResult[0]?.avg ? Number(avgScoreResult[0].avg) : null,
    createdAt: row.createdAt.toISOString(),
  });
});

router.patch("/markets/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateMarketParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateMarketBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  const b = parsed.data;
  if (b.name !== undefined) updateData.name = b.name;
  if (b.population !== undefined) updateData.population = b.population;
  if (b.populationDensity !== undefined) updateData.populationDensity = b.populationDensity;
  if (b.avgIncome !== undefined) updateData.avgIncome = b.avgIncome;
  if (b.urbanizationRate !== undefined) updateData.urbanizationRate = b.urbanizationRate;
  if (b.growthRate !== undefined) updateData.growthRate = b.growthRate;
  if (b.notes !== undefined) updateData.notes = b.notes;

  const [row] = await db.update(marketsTable).set(updateData).where(eq(marketsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Market not found" });
    return;
  }

  res.json({ ...row, locationCount: 0, avgScore: null, createdAt: row.createdAt.toISOString() });
});

router.delete("/markets/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteMarketParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(marketsTable).where(eq(marketsTable.id, params.data.id));
  res.sendStatus(204);
});

router.get("/markets/:id/ranking", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetMarketRankingParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rows = await db
    .select()
    .from(locationsTable)
    .where(eq(locationsTable.marketId, params.data.id))
    .orderBy(locationsTable.overallScore);

  const ranked = rows.map((r, i) => ({
    id: r.id,
    name: r.name,
    city: r.city,
    state: r.state,
    overallScore: r.overallScore,
    demandScore: r.demandScore,
    competitionScore: r.competitionScore,
    logisticsScore: r.logisticsScore,
    recommendation: r.recommendation,
    riskLevel: r.riskLevel,
    confidenceLevel: r.confidenceLevel,
    rank: rows.length - i,
  }));

  res.json(ranked.reverse());
});

export default router;
