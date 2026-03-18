import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "bleibsichtbar2024";

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    (req.session as any).isAdmin = true;
    (req.session as any).username = username;
    res.json({ success: true, message: "Erfolgreich eingeloggt" });
  } else {
    res.status(401).json({ message: "Ungültige Anmeldedaten" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
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
