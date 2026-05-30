import { Router, type IRouter, type Request, type Response } from "express";
import { db, contactsTable } from "@workspace/db";
import { sendAnalyseEmail } from "../lib/mailer.js";

const router: IRouter = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { company, contact } = req.body;
    if (!company || !contact) {
      return res.status(400).json({ message: "Name und Kontakt sind erforderlich" });
    }

    await db.insert(contactsTable).values({
      name: company,
      email: contact,
      company: "",
      message: "",
      service: "LLC Gründung",
    });

    sendAnalyseEmail({ name: company, contact }).catch((err) =>
      console.error("[mailer] analyse email error:", err)
    );

    res.json({ success: true, message: "Anfrage erfolgreich gesendet" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

export default router;
