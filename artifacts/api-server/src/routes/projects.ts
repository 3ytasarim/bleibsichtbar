import { Router, type IRouter, type Request, type Response } from "express";
import { db, projectsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    let query = db.select().from(projectsTable).orderBy(asc(projectsTable.sortOrder));
    const published = req.query.published;
    if (published === "true") {
      const projects = await db.select().from(projectsTable).where(eq(projectsTable.published, true)).orderBy(asc(projectsTable.sortOrder));
      return res.json(projects);
    }
    const projects = await query;
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
    if (!project) return res.status(404).json({ message: "Nicht gefunden" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const [project] = await db.insert(projectsTable).values({
      ...req.body,
      updatedAt: new Date(),
    }).returning();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [project] = await db.update(projectsTable).set({
      ...req.body,
      updatedAt: new Date(),
    }).where(eq(projectsTable.id, id)).returning();
    if (!project) return res.status(404).json({ message: "Nicht gefunden" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(projectsTable).where(eq(projectsTable.id, id));
    res.json({ success: true, message: "Gelöscht" });
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

export default router;
