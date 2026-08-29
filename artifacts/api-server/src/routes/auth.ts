import { Router, type IRouter, type Request, type Response } from "express";
import { db, customersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const router: IRouter = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "bleibsichtbar2024";

function getSessions(req: Request): Map<string, { isAdmin: boolean; username: string }> {
  return (req.app as any)._sessions as Map<string, { isAdmin: boolean; username: string }>;
}

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    (req.session as any).isAdmin = true;
    (req.session as any).username = username;
    // Never confuse this session with a customer session.
    (req.session as any).customerId = undefined;
    (req.session as any).customerRole = undefined;

    req.session.save(() => {
      // Also store in server-side token map for Bearer auth fallback
      const token = req.sessionID;
      getSessions(req).set(token, { isAdmin: true, username });

      res.json({ success: true, message: "Erfolgreich eingeloggt", token, role: "admin" });
    });
    return;
  }

  // Not an admin — check whether it's a customer account.
  try {
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.username, username));
    if (customer && customer.status === "active" && (await bcrypt.compare(password, customer.passwordHash))) {
      (req.session as any).isAdmin = false;
      (req.session as any).customerId = customer.id;
      (req.session as any).customerRole = "customer";

      req.session.save(() => {
        res.json({ success: true, message: "Erfolgreich eingeloggt", role: "customer" });
      });
      return;
    }
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }

  res.status(401).json({ message: "Ungültige Anmeldedaten" });
});

router.post("/logout", (req: Request, res: Response) => {
  const token = req.sessionID;
  getSessions(req).delete(token);
  req.session.destroy(() => {
    res.json({ success: true, message: "Ausgeloggt" });
  });
});

router.get("/me", (req: Request, res: Response) => {
  if ((req.session as any).isAdmin) {
    res.json({ username: (req.session as any).username, isAdmin: true });
  } else {
    res.status(401).json({ message: "Nicht angemeldet" });
  }
});

export default router;
