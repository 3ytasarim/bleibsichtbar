import { Router, type IRouter, type Request, type Response } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const published = req.query.published;
    if (published === "true") {
      const posts = await db.select().from(blogPostsTable).where(eq(blogPostsTable.published, true)).orderBy(desc(blogPostsTable.publishedAt));
      return res.json(posts);
    }
    const posts = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.createdAt));
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, id));
    if (!post) return res.status(404).json({ message: "Nicht gefunden" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const [post] = await db.insert(blogPostsTable).values({
      ...req.body,
      updatedAt: new Date(),
    }).returning();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [post] = await db.update(blogPostsTable).set({
      ...req.body,
      updatedAt: new Date(),
    }).where(eq(blogPostsTable.id, id)).returning();
    if (!post) return res.status(404).json({ message: "Nicht gefunden" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
    res.json({ success: true, message: "Gelöscht" });
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

export default router;
