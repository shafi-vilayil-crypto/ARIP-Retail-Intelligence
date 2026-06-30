import { Router, type IRouter } from "express";
import { db, locationsTable, competitorsTable, marketsTable } from "@workspace/db";
import { sql, eq, desc } from "drizzle-orm";
import { GetTopLocationsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [totals] = await db.select({
    total: sql<number>`count(*)::int`,
    shortlisted: sql<number>`count(*) filter (where status = 'shortlisted')::int`,
    approved: sql<number>`count(*) filter (where status = 'approved')::int`,
    avgScore: sql<number>`round(avg(overall_score)::numeric, 1)`,
    stateCount: sql<number>`count(distinct state)::int`,
  }).from(locationsTable);

  const topCityResult = await db.select({
    city: locationsTable.city,
    avg: sql<number>`avg(overall_score)`,
  }).from(locationsTable).groupBy(locationsTable.city).orderBy(sql`avg(overall_score) desc`).limit(1);

  const topStateResult = await db.select({
    state: locationsTable.state,
    avg: sql<number>`avg(overall_score)`,
  }).from(locationsTable).groupBy(locationsTable.state).orderBy(sql`avg(overall_score) desc`).limit(1);

  const [compCount] = await db.select({ count: sql<number>`count(*)::int` }).from(competitorsTable);

  const [thisMonth] = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(locationsTable).where(sql`created_at >= date_trunc('month', now())`);

  res.json({
    totalLocations: totals.total ?? 0,
    shortlistedLocations: totals.shortlisted ?? 0,
    approvedLocations: totals.approved ?? 0,
    statesCovered: totals.stateCount ?? 0,
    avgOverallScore: totals.avgScore ? Number(totals.avgScore) : 0,
    topCity: topCityResult[0]?.city ?? "N/A",
    topState: topStateResult[0]?.state ?? "N/A",
    competitorCount: compCount.count ?? 0,
    locationsThisMonth: thisMonth.count ?? 0,
  });
});

router.get("/dashboard/top-locations", async (req, res): Promise<void> => {
  const query = GetTopLocationsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const limit = query.data.limit ?? 10;
  const rows = await db
    .select()
    .from(locationsTable)
    .orderBy(desc(locationsTable.overallScore))
    .limit(limit);

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
    rank: i + 1,
  }));

  res.json(ranked);
});

router.get("/dashboard/state-rankings", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      state: locationsTable.state,
      avgScore: sql<number>`round(avg(overall_score)::numeric, 1)`,
      locationCount: sql<number>`count(*)::int`,
      topCity: sql<string>`(select city from locations l2 where l2.state = locations.state order by overall_score desc limit 1)`,
    })
    .from(locationsTable)
    .groupBy(locationsTable.state)
    .orderBy(sql`avg(overall_score) desc`);

  const result = rows.map(r => ({
    state: r.state,
    avgScore: Number(r.avgScore) || 0,
    locationCount: r.locationCount,
    topCity: r.topCity ?? "N/A",
    recommendation: Number(r.avgScore) >= 70 ? "expand" : Number(r.avgScore) >= 50 ? "watch" : "avoid",
    growthRate: null,
  }));

  res.json(result);
});

router.get("/dashboard/score-distribution", async (_req, res): Promise<void> => {
  const buckets = [
    { min: 0, max: 20, range: "0-20", label: "Very Low" },
    { min: 20, max: 40, range: "20-40", label: "Low" },
    { min: 40, max: 60, range: "40-60", label: "Medium" },
    { min: 60, max: 80, range: "60-80", label: "High" },
    { min: 80, max: 100, range: "80-100", label: "Very High" },
  ];

  const result = await Promise.all(buckets.map(async (b) => {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(locationsTable)
      .where(sql`overall_score >= ${b.min} and overall_score < ${b.max + (b.max === 100 ? 1 : 0)}`);
    return { range: b.range, label: b.label, count: count ?? 0 };
  }));

  res.json(result);
});

router.get("/dashboard/competitor-heatmap", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      city: competitorsTable.city,
      state: competitorsTable.state,
      count: sql<number>`count(*)::int`,
      dominantType: sql<string>`mode() within group (order by type)`,
      avgRating: sql<number>`round(avg(avg_rating)::numeric, 1)`,
    })
    .from(competitorsTable)
    .groupBy(competitorsTable.city, competitorsTable.state)
    .orderBy(sql`count(*) desc`)
    .limit(20);

  res.json(rows.map(r => ({
    city: r.city,
    state: r.state,
    count: r.count,
    dominantType: r.dominantType ?? "other",
    avgRating: r.avgRating ? Number(r.avgRating) : null,
  })));
});

export default router;
