import { Router, type IRouter, type Request, type Response } from "express";
import { db, contactsTable } from "@workspace/db";
import { sendAnalyseEmail } from "../lib/mailer.js";

const router: IRouter = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { company, instagram, tiktok, linkedin, goals, contact } = req.body;
    if (!company || !goals || !contact) {
      return res.status(400).json({ message: "Unternehmensname, Ziele und E-Mail sind erforderlich" });
    }

    const message = [
      goals,
      instagram ? `Instagram: ${instagram}` : "",
      tiktok ? `TikTok: ${tiktok}` : "",
      linkedin ? `LinkedIn: ${linkedin}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    await db.insert(contactsTable).values({
      name: company,
      email: contact,
      company,
      message,
      service: "Analyse & Reporting",
    });

    sendAnalyseEmail({ company, instagram, tiktok, linkedin, goals, contact }).catch((err) =>
      console.error("[mailer] analyse email error:", err)
    );

    res.json({ success: true, message: "Analyseanfrage erfolgreich gesendet" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

export default router;
