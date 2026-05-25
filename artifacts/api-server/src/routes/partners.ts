import { Router } from "express";
import multer from "multer";
import { db } from "@workspace/db";
import { partnersTable } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";
import { uploadBufferToGCS, deleteGCSObject } from "../lib/gcsUpload.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

router.get("/", async (_req, res) => {
  try {
    const partners = await db.select().from(partnersTable).orderBy(asc(partnersTable.sortOrder), asc(partnersTable.createdAt));
    res.json(partners);
  } catch {
    res.status(500).json({ error: "Fehler beim Laden der Partner" });
  }
});

router.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, websiteUrl, sortOrder } = req.body as { name?: string; websiteUrl?: string; sortOrder?: string };
    if (!name) { res.status(400).json({ error: "Name ist erforderlich" }); return; }
    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = await uploadBufferToGCS(req.file.buffer, req.file.originalname, req.file.mimetype, "partners");
    }
    const [partner] = await db.insert(partnersTable).values({
      name,
      imageUrl,
      websiteUrl: websiteUrl ?? null,
      sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
    }).returning();
    res.json(partner);
  } catch {
    res.status(500).json({ error: "Fehler beim Erstellen" });
  }
});

router.put("/:id", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const id = parseInt(req.params["id"]!, 10);
    const { name, websiteUrl, sortOrder } = req.body as { name?: string; websiteUrl?: string; sortOrder?: string };
    const updates: Partial<typeof partnersTable.$inferInsert> = {};
    if (name !== undefined) updates.name = name;
    if (websiteUrl !== undefined) updates.websiteUrl = websiteUrl;
    if (sortOrder !== undefined) updates.sortOrder = parseInt(sortOrder, 10);
    if (req.file) {
      updates.imageUrl = await uploadBufferToGCS(req.file.buffer, req.file.originalname, req.file.mimetype, "partners");
    }
    const [updated] = await db.update(partnersTable).set(updates).where(eq(partnersTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Nicht gefunden" }); return; }
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Fehler beim Aktualisieren" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params["id"]!, 10);
    const [deleted] = await db.delete(partnersTable).where(eq(partnersTable.id, id)).returning();
    if (deleted?.imageUrl) await deleteGCSObject(deleted.imageUrl);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Fehler beim Löschen" });
  }
});

export default router;
