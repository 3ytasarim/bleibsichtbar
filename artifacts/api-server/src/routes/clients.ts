import { Router } from "express";
import multer from "multer";
import { db } from "@workspace/db";
import { clientsTable } from "@workspace/db/schema";
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
    const clients = await db.select().from(clientsTable).orderBy(asc(clientsTable.row), asc(clientsTable.sortOrder), asc(clientsTable.createdAt));
    res.json(clients);
  } catch {
    res.status(500).json({ error: "Fehler beim Laden der Kunden" });
  }
});

router.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, sortOrder, row } = req.body as { name?: string; sortOrder?: string; row?: string };
    if (!name) { res.status(400).json({ error: "Name ist erforderlich" }); return; }
    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = await uploadBufferToGCS(req.file.buffer, req.file.originalname, req.file.mimetype, "clients");
    }
    const [client] = await db.insert(clientsTable).values({
      name,
      imageUrl,
      sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
      row: row ? parseInt(row, 10) : 1,
    }).returning();
    res.json(client);
  } catch {
    res.status(500).json({ error: "Fehler beim Erstellen" });
  }
});

router.put("/:id", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const id = parseInt(req.params["id"]!, 10);
    const { name, sortOrder, row } = req.body as { name?: string; sortOrder?: string; row?: string };
    const updates: Partial<typeof clientsTable.$inferInsert> = {};
    if (name !== undefined) updates.name = name;
    if (sortOrder !== undefined) updates.sortOrder = parseInt(sortOrder, 10);
    if (row !== undefined) updates.row = parseInt(row, 10);
    if (req.file) {
      updates.imageUrl = await uploadBufferToGCS(req.file.buffer, req.file.originalname, req.file.mimetype, "clients");
    }
    const [updated] = await db.update(clientsTable).set(updates).where(eq(clientsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Nicht gefunden" }); return; }
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Fehler beim Aktualisieren" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params["id"]!, 10);
    const [deleted] = await db.delete(clientsTable).where(eq(clientsTable.id, id)).returning();
    if (deleted?.imageUrl) await deleteGCSObject(deleted.imageUrl);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Fehler beim Löschen" });
  }
});

export default router;
