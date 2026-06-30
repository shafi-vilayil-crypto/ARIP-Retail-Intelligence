import { Router, type IRouter } from "express";
import { db, scoringWeightsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateScoringWeightsBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/scoring/weights", async (_req, res): Promise<void> => {
  let weights = await db.select().from(scoringWeightsTable).limit(1);
  if (weights.length === 0) {
    const [row] = await db.insert(scoringWeightsTable).values({}).returning();
    weights = [row];
  }
  const w = weights[0];
  res.json({ ...w, updatedAt: w.updatedAt.toISOString() });
});

router.patch("/scoring/weights", async (req, res): Promise<void> => {
  const parsed = UpdateScoringWeightsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let existing = await db.select().from(scoringWeightsTable).limit(1);
  if (existing.length === 0) {
    await db.insert(scoringWeightsTable).values({});
    existing = await db.select().from(scoringWeightsTable).limit(1);
  }

  const [updated] = await db
    .update(scoringWeightsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(scoringWeightsTable.id, existing[0].id))
    .returning();

  res.json({ ...updated, updatedAt: updated.updatedAt.toISOString() });
});

export default router;
