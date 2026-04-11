import { Router, type IRouter, type Request, type Response } from "express";
import { db, onboardingsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";
import { sendOnboardingEmail } from "../lib/mailer.js";

const router: IRouter = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { companyName, ansprechpartner, data } = req.body;
    if (!companyName) {
      return res.status(400).json({ message: "Unternehmensname ist erforderlich" });
    }
    await db.insert(onboardingsTable).values({
      companyName,
      ansprechpartner: ansprechpartner || null,
      data,
    });

    sendOnboardingEmail({
      companyName,
      ansprechpartner,
      formData: data || {},
    }).catch((err) => console.error("[mailer] onboarding email error:", err));

    res.json({ success: true, message: "Onboarding erfolgreich übermittelt" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(onboardingsTable)
      .orderBy(desc(onboardingsTable.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { eq } = await import("drizzle-orm");
    await db.delete(onboardingsTable).where(eq(onboardingsTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
});

export default router;
