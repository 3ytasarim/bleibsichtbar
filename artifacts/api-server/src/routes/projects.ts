import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db, projectsTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

const uploadDir = path.join(process.cwd(), "public", "uploads", "projects");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 20 },
]);

function deleteFile(url: string | null | undefined) {
  if (!url || !url.startsWith("/api/uploads/projects/")) return;
  const rel = url.replace(/^\/api/, "");
  fs.unlink(path.join(process.cwd(), "public", rel), () => {});
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const published = req.query.published;
    const category = req.query.category as string | undefined;
    const conditions = [];
    if (published === "true") conditions.push(eq(projectsTable.published, true));
    if (category) conditions.push(eq(projectsTable.category, category));
    const projects = conditions.length > 0
      ? await db.select().from(projectsTable).where(and(...conditions)).orderBy(asc(projectsTable.sortOrder))
      : await db.select().from(projectsTable).orderBy(asc(projectsTable.sortOrder));
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

router.post("/", requireAdmin, (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) { res.status(400).json({ message: err.message }); return; }
    next();
  });
}, async (req: Request, res: Response) => {
  try {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const body = req.body as Record<string, string>;

    const imageFile = files?.["image"]?.[0];
    const galleryFiles = files?.["gallery"] ?? [];

    const imageUrl = imageFile
      ? `/api/uploads/projects/${imageFile.filename}`
      : (body.imageUrl || null);

    const galleryImages = galleryFiles.length > 0
      ? galleryFiles.map(f => `/api/uploads/projects/${f.filename}`)
      : (body.galleryImages ? (Array.isArray(body.galleryImages) ? body.galleryImages : [body.galleryImages]) : []);

    const tags = body.tags ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];

    const [project] = await db.insert(projectsTable).values({
      title: body.title,
      description: body.description,
      category: body.category,
      imageUrl,
      clientName: body.clientName || null,
      websiteUrl: body.websiteUrl || null,
      tags,
      published: body.published === "true",
      sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
      galleryImages,
      statFollowers: body.statFollowers || null,
      statLikes: body.statLikes || null,
      statViews: body.statViews || null,
      updatedAt: new Date(),
    }).returning();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.put("/:id", requireAdmin, (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) { res.status(400).json({ message: err.message }); return; }
    next();
  });
}, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const files = req.files as Record<string, Express.Multer.File[]>;
    const body = req.body as Record<string, string>;

    const imageFile = files?.["image"]?.[0];
    const galleryFiles = files?.["gallery"] ?? [];

    const updates: Partial<typeof projectsTable.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.category !== undefined) updates.category = body.category;
    if (body.clientName !== undefined) updates.clientName = body.clientName || null;
    if (body.websiteUrl !== undefined) updates.websiteUrl = body.websiteUrl || null;
    if (body.published !== undefined) updates.published = body.published === "true";
    if (body.sortOrder !== undefined) updates.sortOrder = parseInt(body.sortOrder, 10);
    if (body.statFollowers !== undefined) updates.statFollowers = body.statFollowers || null;
    if (body.statLikes !== undefined) updates.statLikes = body.statLikes || null;
    if (body.statViews !== undefined) updates.statViews = body.statViews || null;
    if (body.tags !== undefined) updates.tags = body.tags.split(",").map((t: string) => t.trim()).filter(Boolean);

    if (imageFile) {
      updates.imageUrl = `/api/uploads/projects/${imageFile.filename}`;
    }

    if (galleryFiles.length > 0) {
      updates.galleryImages = galleryFiles.map(f => `/api/uploads/projects/${f.filename}`);
    }

    const [project] = await db.update(projectsTable).set(updates).where(eq(projectsTable.id, id)).returning();
    if (!project) { res.status(404).json({ message: "Nicht gefunden" }); return; }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [deleted] = await db.delete(projectsTable).where(eq(projectsTable.id, id)).returning();
    if (deleted) {
      deleteFile(deleted.imageUrl);
      ((deleted.galleryImages ?? []) as string[]).forEach(deleteFile);
    }
    res.json({ success: true, message: "Gelöscht" });
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

export default router;
