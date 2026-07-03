import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, companiesTable, analysisResultsTable, locationsTable, marketsTable, competitorsTable } from "@workspace/db";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const CreateCompanyBody = z.object({
  name: z.string().min(1),
  industry: z.string().optional(),
  headquarters: z.string().min(1),
  currentStates: z.array(z.string()).optional(),
  businessModel: z.string().optional(),
  products: z.array(z.string()).optional(),
  competitors: z.array(z.string()).optional(),
  expansionGoal: z.string().optional(),
  expansionScope: z.string().optional(),
  expansionStates: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  budget: z.string().optional(),
});

const UpdateCompanyBody = z.object({
  name: z.string().optional(),
  industry: z.string().optional(),
  headquarters: z.string().optional(),
  currentStates: z.array(z.string()).optional(),
  businessModel: z.string().optional(),
  products: z.array(z.string()).optional(),
  competitors: z.array(z.string()).optional(),
  expansionGoal: z.string().optional(),
  expansionScope: z.string().optional(),
  expansionStates: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  budget: z.string().optional(),
});

const router: IRouter = Router();

// ─── List companies ───────────────────────────────────────────
router.get("/companies", async (_req, res): Promise<void> => {
  const rows = await db.select().from(companiesTable).orderBy(desc(companiesTable.createdAt));
  res.json(rows.map(formatCompany));
});

// ─── Create company ───────────────────────────────────────────
router.post("/companies", async (req, res): Promise<void> => {
  const parsed = CreateCompanyBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const d = parsed.data;
  try {
    const [row] = await db.insert(companiesTable).values({
      name: d.name,
      industry: d.industry ?? "Beverage Retail",
      headquarters: d.headquarters,
      currentStates: d.currentStates ?? [],
      businessModel: d.businessModel ?? "Owned",
      products: d.products ?? [],
      competitors: d.competitors ?? [],
      expansionGoal: d.expansionGoal ?? "National",
      expansionScope: d.expansionScope ?? "India",
      expansionStates: d.expansionStates ?? [],
      timeline: d.timeline ?? "3 Years",
      budget: d.budget ?? null,
      analysisStatus: "idle",
      analysisProgress: 0,
      analysisLog: [],
    }).returning();

    res.status(201).json(formatCompany(row));
  } catch (err: any) {
    console.error("CREATE COMPANY DATABASE ERROR:", err);
    res.status(500).json({ error: err.message, detail: err.detail });
  }
});

// ─── Get company ──────────────────────────────────────────────
router.get("/companies/:id", async (req, res): Promise<void> => {
  const id = parseInt(getParam(req, "id"), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [row] = await db.select().from(companiesTable).where(eq(companiesTable.id, id));
  if (!row) { res.status(404).json({ error: "Company not found" }); return; }
  res.json(formatCompany(row));
});

// ─── Update company ───────────────────────────────────────────
router.patch("/companies/:id", async (req, res): Promise<void> => {
  const id = parseInt(getParam(req, "id"), 10);
  const parsed = UpdateCompanyBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  const b = parsed.data;
  if (b.name !== undefined) updateData.name = b.name;
  if (b.industry !== undefined) updateData.industry = b.industry;
  if (b.headquarters !== undefined) updateData.headquarters = b.headquarters;
  if (b.currentStates !== undefined) updateData.currentStates = b.currentStates;
  if (b.businessModel !== undefined) updateData.businessModel = b.businessModel;
  if (b.products !== undefined) updateData.products = b.products;
  if (b.competitors !== undefined) updateData.competitors = b.competitors;
  if (b.expansionGoal !== undefined) updateData.expansionGoal = b.expansionGoal;
  if (b.expansionScope !== undefined) updateData.expansionScope = b.expansionScope;
  if (b.expansionStates !== undefined) updateData.expansionStates = b.expansionStates;
  if (b.timeline !== undefined) updateData.timeline = b.timeline;
  if (b.budget !== undefined) updateData.budget = b.budget;

  const [row] = await db.update(companiesTable).set(updateData).where(eq(companiesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Company not found" }); return; }
  res.json(formatCompany(row));
});

// ─── Delete company ───────────────────────────────────────────
router.delete("/companies/:id", async (req, res): Promise<void> => {
  const id = parseInt(getParam(req, "id"), 10);
  await db.delete(analysisResultsTable).where(eq(analysisResultsTable.companyId, id));
  await db.delete(companiesTable).where(eq(companiesTable.id, id));
  res.sendStatus(204);
});

// ─── AI Agent Analysis (SSE stream) ──────────────────────────
router.post("/companies/:id/analyze", async (req, res): Promise<void> => {
  const id = parseInt(getParam(req, "id"), 10);
  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, id));
  if (!company) { res.status(404).json({ error: "Company not found" }); return; }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const send = (event: object) => res.write(`data: ${JSON.stringify(event)}\n\n`);

  const log: string[] = [];
  const addLog = async (msg: string) => {
    log.push(msg);
    await db.update(companiesTable).set({ analysisLog: log }).where(eq(companiesTable.id, id));
    send({ type: "log", message: msg });
  };

  const setProgress = async (progress: number, status: "running" | "completed" | "failed" = "running") => {
    await db.update(companiesTable).set({ analysisProgress: progress, analysisStatus: status, updatedAt: new Date() }).where(eq(companiesTable.id, id));
    send({ type: "progress", progress, status });
  };

  try {
    await db.update(companiesTable).set({ analysisStatus: "running", analysisProgress: 0, analysisLog: [] }).where(eq(companiesTable.id, id));
    send({ type: "start", companyId: id });

    const profile = {
      name: company.name, industry: company.industry, headquarters: company.headquarters,
      products: company.products, competitors: company.competitors,
      expansionScope: company.expansionScope, expansionStates: company.expansionStates,
      expansionGoal: company.expansionGoal, timeline: company.timeline, budget: company.budget,
      businessModel: company.businessModel,
    };

    // Clear previous results
    await db.delete(analysisResultsTable).where(eq(analysisResultsTable.companyId, id));

    // ══════════════════════════════════════════════════════════
    // 9-AGENT AUTONOMOUS INTELLIGENCE PIPELINE
    // ══════════════════════════════════════════════════════════

    // ── Agent 1/9: Market Research ──────────────────────────
    await addLog("Agent 1/9: Market Research — analyzing demographics, income, urbanization...");
    const marketResult = await runAgent(
      "Market Research Agent",
      `You are a Market Research Agent for an autonomous retail expansion intelligence platform.
Company: ${JSON.stringify(profile)}
Task: Analyze and generate realistic market intelligence for this company's expansion scope. Consider census data, population trends, income levels, urban growth, tourism, and employment.
Return ONLY a valid JSON object with this exact structure:
{
  "topMarkets": [{ "name": string, "state": string, "level": string, "population": number, "avgIncome": number, "growthRate": number, "urbanizationRate": number, "opportunityScore": number, "notes": string }],
  "stateInsights": [{ "state": string, "avgScore": number, "locationCount": number, "topCity": string, "recommendation": string, "growthRate": number }],
  "summary": string,
  "keyInsights": [string]
}`
    );
    await db.insert(analysisResultsTable).values({ companyId: id, agentName: "Market Research Agent", resultType: "markets", data: marketResult, summary: marketResult.summary as string, confidence: 0.85 });
    await setProgress(11);

    // Seed top markets into markets table
    if (marketResult.topMarkets) {
      for (const m of (marketResult.topMarkets as Array<Record<string, unknown>>).slice(0, 8)) {
        await db.insert(marketsTable).values({
          name: m.name as string, level: (m.level as "city" | "state" | "district") || "city",
          state: m.state as string, population: m.population as number, avgIncome: m.avgIncome as number,
          growthRate: m.growthRate as number, urbanizationRate: m.urbanizationRate as number,
          notes: m.notes as string,
        }).onConflictDoNothing();
      }
    }

    // ── Agent 2/9: GIS Intelligence ─────────────────────────
    await addLog("Agent 2/9: GIS Intelligence — mapping roads, transit, POIs, identifying locations...");
    const gisResult = await runAgent(
      "GIS Intelligence Agent",
      `You are a GIS Intelligence Agent for a retail expansion platform.
Company: ${JSON.stringify(profile)}
Task: Map the geographic landscape and identify 8-12 specific high-potential retail outlet locations. Consider roads, metro stations, bus stations, airports, colleges, offices, hospitals, and residential density.
Return ONLY valid JSON:
{
  "locations": [{ "name": string, "address": string, "city": string, "state": string, "district": string, "latitude": number, "longitude": number, "microMarket": string, "population": number, "populationDensity": number, "avgMonthlyIncome": number, "footfallPerDay": number, "deliveryDemandScore": number, "officeDensityScore": number, "studentDensityScore": number, "commercialActivityScore": number, "tourismScore": number, "nightlifeScore": number, "roadAccess": boolean, "parkingAvailable": boolean, "publicTransport": boolean, "rentalCostPerSqft": number, "overallScore": number, "recommendation": string, "riskLevel": string, "notes": string }],
  "poiSummary": { "metroStations": number, "busStops": number, "colleges": number, "offices": number, "hospitals": number },
  "summary": string
}`
    );
    await db.insert(analysisResultsTable).values({ companyId: id, agentName: "GIS Intelligence Agent", resultType: "locations", data: gisResult, summary: gisResult.summary as string, confidence: 0.80 });

    // Seed locations
    if (gisResult.locations) {
      const validRecs = ["expand", "watch", "avoid", "under_review"];
      const validRisks = ["low", "medium", "high"];
      for (const loc of (gisResult.locations as Array<Record<string, unknown>>).slice(0, 12)) {
        const rec = validRecs.includes(loc.recommendation as string) ? loc.recommendation as string : "under_review";
        const risk = validRisks.includes(loc.riskLevel as string) ? loc.riskLevel as string : "medium";
        await db.insert(locationsTable).values({
          name: loc.name as string, address: (loc.address as string) ?? null, state: loc.state as string, city: loc.city as string,
          district: (loc.district as string) ?? null, microMarket: (loc.microMarket as string) ?? null,
          latitude: (loc.latitude as number) ?? 0, longitude: (loc.longitude as number) ?? 0,
          status: "candidate", overallScore: (loc.overallScore as number) ?? 50,
          population: (loc.population as number) ?? null, populationDensity: (loc.populationDensity as number) ?? null,
          avgMonthlyIncome: (loc.avgMonthlyIncome as number) ?? null, footfallPerDay: (loc.footfallPerDay as number) ?? null,
          deliveryDemandScore: (loc.deliveryDemandScore as number) ?? null,
          officeDensityScore: (loc.officeDensityScore as number) ?? null,
          studentDensityScore: (loc.studentDensityScore as number) ?? null,
          commercialActivityScore: (loc.commercialActivityScore as number) ?? null,
          tourismScore: (loc.tourismScore as number) ?? null, nightlifeScore: (loc.nightlifeScore as number) ?? null,
          roadAccess: (loc.roadAccess as boolean) ?? null, parkingAvailable: (loc.parkingAvailable as boolean) ?? null,
          publicTransport: (loc.publicTransport as boolean) ?? null, rentalCostPerSqft: (loc.rentalCostPerSqft as number) ?? null,
          recommendation: rec as "expand" | "watch" | "avoid" | "under_review",
          riskLevel: risk as "low" | "medium" | "high",
          confidenceLevel: "medium", notes: (loc.notes as string) ?? null,
        }).onConflictDoNothing();
      }
    }
    await setProgress(22);

    // ── Agent 3/9: Competitor Intelligence ───────────────────
    await addLog("Agent 3/9: Competitor Intelligence — mapping rival brands, density, and market share...");
    const competitorResult = await runAgent(
      "Competitor Intelligence Agent",
      `You are a Competitor Intelligence Agent for a retail expansion platform.
Company: ${JSON.stringify(profile)}
Task: Research and map all relevant competitors in the expansion scope. Include realistic ratings, market share, strengths, weaknesses. Find every competing outlet type.
Return ONLY a valid JSON object:
{
  "competitors": [{ "name": string, "brand": string, "type": string, "city": string, "state": string, "priceRange": string, "avgRating": number, "reviewCount": number, "deliveryAvailable": boolean, "strengths": string, "weaknesses": string, "marketShare": number }],
  "marketDominance": [{ "brand": string, "overallShare": number, "cities": [string] }],
  "gapAnalysis": string,
  "summary": string
}`
    );
    await db.insert(analysisResultsTable).values({ companyId: id, agentName: "Competitor Intelligence Agent", resultType: "competitors", data: competitorResult, summary: competitorResult.summary as string, confidence: 0.82 });

    // Seed competitors
    if (competitorResult.competitors) {
      const validTypes = ["milma_booth", "juice_shop", "tea_shop", "bubble_tea", "cafe", "fresh_juice_chain", "ice_cream_chain", "convenience_store", "mall_food_court", "petrol_station", "other"];
      const validPriceRanges = ["budget", "mid", "premium"];
      for (const c of (competitorResult.competitors as Array<Record<string, unknown>>).slice(0, 20)) {
        const ctype = validTypes.includes(c.type as string) ? c.type as string : "other";
        const priceRange = validPriceRanges.includes(c.priceRange as string) ? c.priceRange as string : null;
        await db.insert(competitorsTable).values({
          name: c.name as string, brand: (c.brand as string) ?? null, type: ctype as "milma_booth" | "juice_shop" | "tea_shop" | "bubble_tea" | "cafe" | "fresh_juice_chain" | "ice_cream_chain" | "convenience_store" | "mall_food_court" | "petrol_station" | "other",
          city: c.city as string, state: c.state as string, priceRange: priceRange as "budget" | "mid" | "premium" | null,
          avgRating: (c.avgRating as number) ?? null, reviewCount: (c.reviewCount as number) ?? null,
          deliveryAvailable: (c.deliveryAvailable as boolean) ?? null,
          strengths: (c.strengths as string) ?? null, weaknesses: (c.weaknesses as string) ?? null,
          marketShare: (c.marketShare as number) ?? null,
        }).onConflictDoNothing();
      }
    }
    await setProgress(33);

    // ── Agent 4/9: Demand Intelligence ──────────────────────
    await addLog("Agent 4/9: Demand Intelligence — predicting consumption potential by segment...");
    const demandResult = await runAgent(
      "Demand Intelligence Agent",
      `You are a Demand Intelligence Agent for a ${profile.industry} company.
Company: ${JSON.stringify(profile)}
Task: Instead of just population, predict actual consumption potential using: students, office workers, tourists, delivery demand, apartment density, nightlife, and daily footfall. Model demand drivers with weights.
Return ONLY valid JSON:
{
  "demandDrivers": [{ "driver": string, "weight": number, "description": string }],
  "cityDemand": [{ "city": string, "state": string, "dailyPotential": number, "deliveryShare": number, "peakHours": string, "topSegment": string, "demandScore": number }],
  "onlinePlatforms": [{ "platform": string, "coverage": string, "peakHour": string, "avgRating": number }],
  "summary": string,
  "keyInsights": [string]
}`
    );
    await db.insert(analysisResultsTable).values({ companyId: id, agentName: "Demand Intelligence Agent", resultType: "demand", data: demandResult, summary: demandResult.summary as string, confidence: 0.78 });
    await setProgress(44);

    // ── Agent 5/9: Online Commerce ──────────────────────────
    await addLog("Agent 5/9: Online Commerce — researching delivery platform coverage & ratings...");
    const onlineCommerceResult = await runAgent(
      "Online Commerce Agent",
      `You are an Online Commerce Agent for a retail expansion platform.
Company: ${JSON.stringify(profile)}
Task: Research the online delivery ecosystem in the target expansion geography. Analyze Swiggy, Zomato, Blinkit, Swiggy Instamart, BigBasket, and ONDC. Measure delivery coverage, peak hours, customer ratings, reviews, and availability for the company's product category.
Return ONLY valid JSON:
{
  "platforms": [{ "platform": string, "coverage": string, "peakHour": string, "avgRating": number, "available": boolean, "deliveryTime": string, "commissionPct": number, "customerReviews": string }],
  "deliveryCoverage": { "totalCities": number, "coveredCities": number, "coveragePercent": number },
  "recommendations": [string],
  "summary": string
}`
    );
    await db.insert(analysisResultsTable).values({ companyId: id, agentName: "Online Commerce Agent", resultType: "online_commerce", data: onlineCommerceResult, summary: onlineCommerceResult.summary as string, confidence: 0.80 });
    await setProgress(55);

    // ── Agent 6/9: Financial Intelligence ────────────────────
    await addLog("Agent 6/9: Financial Intelligence — building revenue models, ROI, sensitivity analysis...");
    const financialResult = await runAgent(
      "Financial Intelligence Agent",
      `You are a Financial Intelligence Agent for retail expansion.
Company: ${JSON.stringify(profile)}
Task: Create detailed financial models including investment, ROI, break-even, 5-year projections, sensitivity analysis, and scenario planning for this company's expansion.
Return ONLY valid JSON:
{
  "investment": { "minCapex": number, "maxCapex": number, "avgCapex": number, "currency": "INR" },
  "unitEconomics": { "avgMonthlyRevenue": number, "avgMonthlyOpex": number, "avgEbitda": number, "grossMarginPct": number, "breakEvenMonths": number, "roiPct": number, "paybackMonths": number },
  "scenarios": [{ "name": string, "capex": number, "monthlyRevenue": number, "ebitda": number, "roi": number, "breakEven": number }],
  "yearlyProjection": [{ "year": number, "revenue": number, "outlets": number, "totalInvestment": number }],
  "sensitivityAnalysis": { "bestCase": { "roi": number, "breakEven": number }, "worstCase": { "roi": number, "breakEven": number } },
  "summary": string,
  "keyRisks": [string]
}`
    );
    await db.insert(analysisResultsTable).values({ companyId: id, agentName: "Financial Intelligence Agent", resultType: "financial", data: financialResult, summary: financialResult.summary as string, confidence: 0.83 });
    await setProgress(66);

    // ── Agent 7/9: Logistics ────────────────────────────────
    await addLog("Agent 7/9: Logistics — designing supply chain: Factory → Warehouse → Cold Storage → Outlet → Customer...");
    const logisticsResult = await runAgent(
      "Logistics Agent",
      `You are a Logistics Agent for a retail expansion platform.
Company: ${JSON.stringify(profile)}
Task: Design the optimal supply chain for this company's expansion. Plan: Factory → Warehouse → Cold Storage → Distributor → Outlet → Customer. Optimize routes, costs, spoilage, fuel, and warehouse placement.
Return ONLY valid JSON:
{
  "supplyChain": [{ "node": string, "location": string, "capacity": string, "cost": string }],
  "warehouses": [{ "name": string, "location": string, "capacity": string, "type": string }],
  "routes": [{ "from": string, "to": string, "distance": string, "cost": string, "time": string }],
  "keyMetrics": { "routeEfficiency": string, "costSaving": string, "spoilageReduction": string, "warehouseSuggestion": string },
  "routeEfficiency": string,
  "costSaving": string,
  "spoilageReduction": string,
  "warehouseSuggestion": string,
  "summary": string
}`
    );
    await db.insert(analysisResultsTable).values({ companyId: id, agentName: "Logistics Agent", resultType: "logistics", data: logisticsResult, summary: logisticsResult.summary as string, confidence: 0.79 });
    await setProgress(77);

    // ── Agent 8/9: Scoring Agent ────────────────────────────
    await addLog("Agent 8/9: Scoring Agent — computing 8-dimension expansion scores...");
    const scoringResult = await runAgent(
      "Scoring Agent",
      `You are a Scoring Agent for retail expansion intelligence.
Company: ${JSON.stringify(profile)}
Market data collected from 7 prior agents — now produce final expansion intelligence scores across 8 dimensions.
Return ONLY valid JSON:
{
  "overallExpansionScore": number,
  "demandScore": number,
  "competitionScore": number,
  "growthScore": number,
  "riskScore": number,
  "deliveryScore": number,
  "financialScore": number,
  "accessibilityScore": number,
  "topExpansionState": string,
  "topDistrict": string,
  "bestTown": string,
  "competition": string,
  "deliveryReady": boolean,
  "recommendation": string,
  "summary": string,
  "actionItems": [string]
}`
    );
    await db.insert(analysisResultsTable).values({ companyId: id, agentName: "Scoring Agent", resultType: "scores", data: scoringResult, summary: scoringResult.summary as string, confidence: 0.88 });
    await setProgress(88);

    // ── Agent 9/9: Report Generator ─────────────────────────
    await addLog("Agent 9/9: Report Generator — synthesising executive insights from all 8 agents...");
    const reportResult = await runAgent(
      "Report Generator",
      `You are an Executive Report Generator for an autonomous retail intelligence platform.
Company: ${JSON.stringify(profile)}
Task: Synthesise findings from all 8 prior agents (Market Research, GIS, Competitor, Demand, Online Commerce, Financial, Logistics, Scoring) into a comprehensive executive brief.
Return ONLY valid JSON:
{
  "executiveSummary": string,
  "topOpportunities": [{ "title": string, "description": string, "impact": string }],
  "warnings": [{ "title": string, "description": string, "severity": string }],
  "nextSteps": [string],
  "summary": string
}`
    );
    await db.insert(analysisResultsTable).values({ companyId: id, agentName: "Report Generator", resultType: "report", data: reportResult, summary: reportResult.summary as string, confidence: 0.92 });

    await setProgress(100, "completed");
    await addLog("✓ Analysis complete — all 9 agents finished successfully.");
    send({ type: "done", companyId: id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await db.update(companiesTable).set({ analysisStatus: "failed", updatedAt: new Date() }).where(eq(companiesTable.id, id));
    send({ type: "error", message: msg });
  } finally {
    res.end();
  }
});

// ─── Get analysis results ─────────────────────────────────────
router.get("/companies/:id/results", async (req, res): Promise<void> => {
  const id = parseInt(getParam(req, "id"), 10);
  const rows = await db.select().from(analysisResultsTable).where(eq(analysisResultsTable.companyId, id)).orderBy(analysisResultsTable.createdAt);
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

// ─── Get company dashboard ────────────────────────────────────
router.get("/companies/:id/dashboard", async (req, res): Promise<void> => {
  const id = parseInt(getParam(req, "id"), 10);
  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, id));
  if (!company) { res.status(404).json({ error: "Not found" }); return; }

  const results = await db.select().from(analysisResultsTable).where(eq(analysisResultsTable.companyId, id));
  const topLocations = await db.select().from(locationsTable).orderBy(desc(locationsTable.overallScore)).limit(8);
  const scoringResult = results.find(r => r.resultType === "scores");
  const financialResult = results.find(r => r.resultType === "financial");
  const reportResult = results.find(r => r.resultType === "report");
  const scores = (scoringResult?.data ?? {}) as Record<string, unknown>;
  const financial = (financialResult?.data ?? {}) as Record<string, unknown>;
  const report = (reportResult?.data ?? {}) as Record<string, unknown>;

  res.json({
    companyId: id,
    companyName: company.name,
    analysisStatus: company.analysisStatus,
    topState: scores.topExpansionState ?? null,
    topDistrict: scores.topDistrict ?? null,
    bestTown: scores.bestTown ?? null,
    expansionScore: scores.overallExpansionScore ?? null,
    expectedRoiMonths: (financial.unitEconomics as Record<string, unknown>)?.breakEvenMonths ?? null,
    competition: scores.competition ?? null,
    investment: (financial.investment as Record<string, unknown>)?.avgCapex ? `₹${((financial.investment as Record<string, unknown>).avgCapex as number / 100000).toFixed(1)}L` : null,
    deliveryReady: scores.deliveryReady ?? null,
    topLocations: topLocations.map((l, i) => ({
      id: l.id, name: l.name, city: l.city, state: l.state,
      overallScore: l.overallScore, recommendation: l.recommendation,
      riskLevel: l.riskLevel, confidenceLevel: l.confidenceLevel,
      demandScore: l.demandScore, competitionScore: l.competitionScore,
      logisticsScore: l.logisticsScore, rank: i + 1,
    })),
    marketInsights: (report.topOpportunities as {description: string}[])?.map(o => o.description) ?? [],
    competitorSummary: ((results.find(r => r.resultType === "competitors")?.data as Record<string, unknown>)?.marketDominance ?? []) as Record<string, unknown>[],
    financialHighlights: (financial.unitEconomics ?? {}) as Record<string, unknown>,
    agentResults: results.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })),
  });
});

// ─── Helpers ──────────────────────────────────────────────────
function getParam(req: { params: Record<string, string | string[]> }, key: string): string {
  const v = req.params[key];
  return Array.isArray(v) ? v[0] : v;
}

function formatCompany(c: { id: number; name: string; industry: string; headquarters: string; currentStates: unknown; businessModel: string; products: unknown; competitors: unknown; expansionGoal: string; expansionScope: string; expansionStates: unknown; timeline: string; budget: string | null; analysisStatus: string; analysisProgress: number; analysisLog: unknown; createdAt: Date; updatedAt: Date }) {
  return {
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt?.toISOString() ?? null,
  };
}

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

async function runAgent(_name: string, prompt: string): Promise<Record<string, unknown>> {
  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json", maxOutputTokens: 8192 },
  });
  try {
    const text = response.text ?? "{}";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { error: "Failed to parse agent response", raw: response.text };
  }
}

export default router;
