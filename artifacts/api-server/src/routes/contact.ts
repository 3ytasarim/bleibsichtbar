import { Router, type IRouter, type Request, type Response } from "express";
import { db, contactsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";
import { sendContactEmail } from "../lib/mailer.js";

const router: IRouter = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, company, message, service } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, E-Mail und Nachricht sind erforderlich" });
    }
    await db.insert(contactsTable).values({ name, email, phone, company, message, service });

    sendContactEmail({ name, email, phone, company, message, service }).catch((err) =>
      console.error("[mailer] contact email error:", err)
    );

    res.json({ success: true, message: "Nachricht erfolgreich gesendet" });
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const contacts = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

export default router;
