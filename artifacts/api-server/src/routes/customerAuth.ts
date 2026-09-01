import { Router, type IRouter, type Request, type Response } from "express";
import { db, customersTable } from "@workspace/db";
import { eq, ilike, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

const router: IRouter = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Benutzername und Passwort erforderlich" });
  }

  try {
    // Accepts either the username or the email address in the same field —
    // email match is case-insensitive since email addresses conventionally are.
    const [customer] = await db
      .select()
      .from(customersTable)
      .where(or(eq(customersTable.username, username), ilike(customersTable.email, username)));
    if (!customer || customer.status !== "active") {
      return res.status(401).json({ message: "Ungültige Anmeldedaten" });
    }

    const valid = await bcrypt.compare(password, customer.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Ungültige Anmeldedaten" });
    }

    // Never confuse this session with an admin session.
    (req.session as any).isAdmin = false;
    (req.session as any).customerId = customer.id;
    (req.session as any).customerRole = "customer";

    req.session.save(() => {
      res.json({ success: true, message: "Erfolgreich eingeloggt" });
    });
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Ausgeloggt" });
  });
});

router.get("/me", async (req: Request, res: Response) => {
  const customerId = (req.session as any).customerId;
  if (!customerId || (req.session as any).customerRole !== "customer") {
    return res.status(401).json({ message: "Nicht angemeldet" });
  }

  try {
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, customerId));
    if (!customer) {
      return res.status(401).json({ message: "Nicht angemeldet" });
    }
    res.json({
      id: customer.id,
      companyName: customer.companyName,
      username: customer.username,
      status: customer.status,
      startDate: customer.startDate,
      serviceTypes: customer.serviceTypes,
    });
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

export default router;
