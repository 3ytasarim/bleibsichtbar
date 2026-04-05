import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { clientsTable } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import type { Request } from "express";

const router = Router();

const uploadDir = path.join(process.cwd(), "public", "uploads", "clients");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `client-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

function isAdmin(req: Request): boolean {
  return !!(req.session as { admin?: boolean }).admin;
}

router.get("/", async (_req, res) => {
  try {
    const clients = await db
      .select()
      .from(clientsTable)
      .orderBy(asc(clientsTable.sortOrder), asc(clientsTable.createdAt));
    res.json(clients);
  } catch (e) {
    res.status(500).json({ error: "Fehler beim Laden der Kunden" });
  }
});

router.post("/", (req, res, next) => {
  if (!isAdmin(req)) { res.status(401).json({ error: "Nicht autorisiert" }); return; }
  next();
}, upload.single("image"), async (req, res) => {
  try {
    const { name, sortOrder } = req.body as { name?: string; sortOrder?: string };
    if (!name) { res.status(400).json({ error: "Name ist erforderlich" }); return; }
    const imageUrl = req.file ? `/api/uploads/clients/${req.file.filename}` : null;
    const [client] = await db.insert(clientsTable).values({
      name,
      imageUrl,
      sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
    }).returning();
    res.json(client);
  } catch (e) {
    res.status(500).json({ error: "Fehler beim Erstellen" });
  }
});

router.put("/:id", (req, res, next) => {
  if (!isAdmin(req)) { res.status(401).json({ error: "Nicht autorisiert" }); return; }
  next();
}, upload.single("image"), async (req, res) => {
  try {
    const id = parseInt(req.params["id"]!, 10);
    const { name, sortOrder } = req.body as { name?: string; sortOrder?: string };
    const updates: Partial<typeof clientsTable.$inferInsert> = {};
    if (name !== undefined) updates.name = name;
    if (sortOrder !== undefined) updates.sortOrder = parseInt(sortOrder, 10);
    if (req.file) updates.imageUrl = `/api/uploads/clients/${req.file.filename}`;
    const [updated] = await db.update(clientsTable).set(updates).where(eq(clientsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Nicht gefunden" }); return; }
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Fehler beim Aktualisieren" });
  }
});

router.delete("/:id", async (req, res) => {
  if (!isAdmin(req)) { res.status(401).json({ error: "Nicht autorisiert" }); return; }
  try {
    const id = parseInt(req.params["id"]!, 10);
    const [deleted] = await db.delete(clientsTable).where(eq(clientsTable.id, id)).returning();
    if (deleted?.imageUrl) {
      const relative = deleted.imageUrl.replace(/^\/api/, "");
      const filePath = path.join(process.cwd(), "public", relative);
      fs.unlink(filePath, () => {});
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Fehler beim Löschen" });
  }
});

export default router;
