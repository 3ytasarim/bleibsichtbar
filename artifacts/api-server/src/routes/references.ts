import { Router, type IRouter, type Request, type Response } from "express";
import { db, referencesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const published = req.query.published;
    if (published === "true") {
      const refs = await db.select().from(referencesTable).where(eq(referencesTable.published, true)).orderBy(asc(referencesTable.sortOrder));
      return res.json(refs);
    }
    const refs = await db.select().from(referencesTable).orderBy(asc(referencesTable.sortOrder));
    res.json(refs);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const [ref] = await db.insert(referencesTable).values(req.body).returning();
    res.status(201).json(ref);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [ref] = await db.update(referencesTable).set(req.body).where(eq(referencesTable.id, id)).returning();
    if (!ref) return res.status(404).json({ message: "Nicht gefunden" });
    res.json(ref);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(referencesTable).where(eq(referencesTable.id, id));
    res.json({ success: true, message: "Gelöscht" });
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

export default router;
