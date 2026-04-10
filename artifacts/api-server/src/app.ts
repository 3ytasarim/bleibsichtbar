import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import compression from "compression";
import path from "path";
import router from "./routes/index.js";

const app: Express = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(compression());

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https:",
      "connect-src 'self' https: wss:",
      "frame-ancestors 'none'",
    ].join("; ")
  );
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "bleibsichtbar-secret-2024",
  resave: true,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  },
}));

// Allow token-based auth via Authorization header as fallback for iframe environments
const sessions = new Map<string, { isAdmin: boolean; username: string }>();

app.use((req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (authHeader?.startsWith("Bearer ") && !(req.session as any).isAdmin) {
    const token = authHeader.slice(7);
    const data = sessions.get(token);
    if (data) {
      (req.session as any).isAdmin = data.isAdmin;
      (req.session as any).username = data.username;
    }
  }
  next();
});

(app as any)._sessions = sessions;

app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));
app.use("/api/uploads", express.static(path.join(process.cwd(), "public", "uploads")));
app.use("/api", router);

export default app;
