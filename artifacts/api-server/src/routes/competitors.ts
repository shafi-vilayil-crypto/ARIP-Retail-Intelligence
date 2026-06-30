import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, competitorsTable } from "@workspace/db";
import {
  ListCompetitorsQueryParams,
  CreateCompetitorBody,
  GetCompetitorParams,
  UpdateCompetitorParams,
  UpdateCompetitorBody,
  DeleteCompetitorParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/competitors", async (req, res): Promise<void> => {
  const query = ListCompetitorsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [];
  if (query.data.type) conditions.push(eq(competitorsTable.type, query.data.type as "milma_booth" | "juice_shop" | "tea_shop" | "bubble_tea" | "cafe" | "fresh_juice_chain" | "ice_cream_chain" | "convenience_store" | "mall_food_court" | "petrol_station" | "other"));
  if (query.data.city) conditions.push(eq(competitorsTable.city, query.data.city));

  const rows = await db
    .select()
    .from(competitorsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(competitorsTable.city, competitorsTable.name);

  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/competitors", async (req, res): Promise<void> => {
  const parsed = CreateCompetitorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.insert(competitorsTable).values({
    name: parsed.data.name,
    brand: parsed.data.brand ?? null,
    type: parsed.data.type as "milma_booth" | "juice_shop" | "tea_shop" | "bubble_tea" | "cafe" | "fresh_juice_chain" | "ice_cream_chain" | "convenience_store" | "mall_food_court" | "petrol_station" | "other",
    city: parsed.data.city,
    state: parsed.data.state,
    latitude: parsed.data.latitude ?? null,
    longitude: parsed.data.longitude ?? null,
    address: parsed.data.address ?? null,
    priceRange: (parsed.data.priceRange as "budget" | "mid" | "premium" | undefined) ?? null,
    avgRating: parsed.data.avgRating ?? null,
    reviewCount: parsed.data.reviewCount ?? null,
    deliveryAvailable: parsed.data.deliveryAvailable ?? null,
    operatingHours: parsed.data.operatingHours ?? null,
    strengths: parsed.data.strengths ?? null,
    weaknesses: parsed.data.weaknesses ?? null,
    marketShare: parsed.data.marketShare ?? null,
    notes: parsed.data.notes ?? null,
  }).returning();

  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.get("/competitors/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetCompetitorParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(competitorsTable).where(eq(competitorsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Competitor not found" });
    return;
  }

  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/competitors/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateCompetitorParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCompetitorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  const b = parsed.data;
  if (b.name !== undefined) updateData.name = b.name;
  if (b.brand !== undefined) updateData.brand = b.brand;
  if (b.priceRange !== undefined) updateData.priceRange = b.priceRange;
  if (b.avgRating !== undefined) updateData.avgRating = b.avgRating;
  if (b.reviewCount !== undefined) updateData.reviewCount = b.reviewCount;
  if (b.deliveryAvailable !== undefined) updateData.deliveryAvailable = b.deliveryAvailable;
  if (b.operatingHours !== undefined) updateData.operatingHours = b.operatingHours;
  if (b.strengths !== undefined) updateData.strengths = b.strengths;
  if (b.weaknesses !== undefined) updateData.weaknesses = b.weaknesses;
  if (b.marketShare !== undefined) updateData.marketShare = b.marketShare;
  if (b.notes !== undefined) updateData.notes = b.notes;

  const [row] = await db.update(competitorsTable).set(updateData).where(eq(competitorsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Competitor not found" });
    return;
  }

  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/competitors/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteCompetitorParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(competitorsTable).where(eq(competitorsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
