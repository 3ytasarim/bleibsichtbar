import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db, referencesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

const uploadDir = path.join(process.cwd(), "public", "uploads", "references");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `ref-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

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

router.post("/", requireAdmin, upload.single("logo"), async (req: Request, res: Response) => {
  try {
    const { clientName, clientTitle, company, websiteUrl, testimonial, rating, published, sortOrder } = req.body as Record<string, string>;
    if (!clientName || !company) { res.status(400).json({ message: "Pflichtfelder fehlen" }); return; }
    const logoUrl = req.file ? `/api/uploads/references/${req.file.filename}` : (req.body.logoUrl || null);
    const [ref] = await db.insert(referencesTable).values({
      clientName,
      clientTitle: clientTitle || null,
      company,
      logoUrl,
      websiteUrl: websiteUrl || null,
      testimonial: testimonial || null,
      rating: rating ? parseInt(rating, 10) : 5,
      published: published === "true",
      sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
    }).returning();
    res.status(201).json(ref);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.put("/:id", requireAdmin, upload.single("logo"), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { clientName, clientTitle, company, websiteUrl, testimonial, rating, published, sortOrder, clearLogo } = req.body as Record<string, string>;
    const updates: Partial<typeof referencesTable.$inferInsert> = {};
    if (clientName !== undefined) updates.clientName = clientName;
    if (clientTitle !== undefined) updates.clientTitle = clientTitle || null;
    if (company !== undefined) updates.company = company;
    if (websiteUrl !== undefined) updates.websiteUrl = websiteUrl || null;
    if (testimonial !== undefined) updates.testimonial = testimonial || null;
    if (rating !== undefined) updates.rating = parseInt(rating, 10);
    if (published !== undefined) updates.published = published === "true";
    if (sortOrder !== undefined) updates.sortOrder = parseInt(sortOrder, 10);
    if (req.file) {
      updates.logoUrl = `/api/uploads/references/${req.file.filename}`;
    } else if (clearLogo === "true") {
      updates.logoUrl = null;
    }
    const [ref] = await db.update(referencesTable).set(updates).where(eq(referencesTable.id, id)).returning();
    if (!ref) { res.status(404).json({ message: "Nicht gefunden" }); return; }
    res.json(ref);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [deleted] = await db.delete(referencesTable).where(eq(referencesTable.id, id)).returning();
    if (deleted?.logoUrl?.startsWith("/api/uploads/references/")) {
      const relative = deleted.logoUrl.replace(/^\/api/, "");
      fs.unlink(path.join(process.cwd(), "public", relative), () => {});
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

export default router;
