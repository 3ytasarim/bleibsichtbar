import { Router, type IRouter, type Request, type Response } from "express";
import { db, seoTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

const DEFAULT_PAGES = [
  { slug: "home", pageLabel: "Startseite (/)" },
  { slug: "social-media", pageLabel: "Social Media (/social-media)" },
  { slug: "webseiten", pageLabel: "Webseiten (/webseiten)" },
  { slug: "marketing-ads", pageLabel: "Marketing Ads (/marketing-ads)" },
  { slug: "ki-automatisierungen", pageLabel: "KI & Automatisierungen (/ki-automatisierungen)" },
  { slug: "analyse", pageLabel: "LLC Gründung (/analyse)" },
  { slug: "projekte", pageLabel: "Projekte (/projekte)" },
  { slug: "blog", pageLabel: "Blog (/blog)" },
  { slug: "kontakt", pageLabel: "Kontakt (/kontakt)" },
  { slug: "referenzen", pageLabel: "Referenzen (/referenzen)" },
  { slug: "global", pageLabel: "Global (alle Seiten)" },
];

const EMPTY_ROW = {
  id: null,
  metaTitle: "",
  metaDescription: "",
  metaTitleEn: "",
  metaDescriptionEn: "",
  metaTitleNl: "",
  metaDescriptionNl: "",
  metaTitleFr: "",
  metaDescriptionFr: "",
  keywords: "",
  googleVerification: "",
  headScript: "",
  bodyScript: "",
  updatedAt: null,
};

router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(seoTable);
    const map = Object.fromEntries(rows.map(r => [r.slug, r]));
    const result = DEFAULT_PAGES.map(p => map[p.slug] ?? { ...EMPTY_ROW, slug: p.slug, pageLabel: p.pageLabel });
    res.json(result);
  } catch {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const [row] = await db.select().from(seoTable).where(eq(seoTable.slug, req.params.slug));
    if (!row) { res.json(null); return; }
    res.json(row);
  } catch {
    res.status(500).json({ message: "Serverfehler" });
  }
});

router.put("/:slug", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const {
      pageLabel,
      metaTitle, metaDescription,
      metaTitleEn, metaDescriptionEn,
      metaTitleNl, metaDescriptionNl,
      metaTitleFr, metaDescriptionFr,
      keywords, googleVerification, headScript, bodyScript,
    } = req.body;
    const defaultPage = DEFAULT_PAGES.find(p => p.slug === slug);
    const label = pageLabel || defaultPage?.pageLabel || slug;

    const [existing] = await db.select().from(seoTable).where(eq(seoTable.slug, slug));

    let row;
    if (existing) {
      [row] = await db.update(seoTable).set({
        metaTitle: metaTitle ?? existing.metaTitle,
        metaDescription: metaDescription ?? existing.metaDescription,
        metaTitleEn: metaTitleEn ?? existing.metaTitleEn,
        metaDescriptionEn: metaDescriptionEn ?? existing.metaDescriptionEn,
        metaTitleNl: metaTitleNl ?? existing.metaTitleNl,
        metaDescriptionNl: metaDescriptionNl ?? existing.metaDescriptionNl,
        metaTitleFr: metaTitleFr ?? existing.metaTitleFr,
        metaDescriptionFr: metaDescriptionFr ?? existing.metaDescriptionFr,
        keywords: keywords ?? existing.keywords,
        googleVerification: googleVerification ?? existing.googleVerification,
        headScript: headScript ?? existing.headScript,
        bodyScript: bodyScript ?? existing.bodyScript,
        updatedAt: new Date(),
      }).where(eq(seoTable.slug, slug)).returning();
    } else {
      [row] = await db.insert(seoTable).values({
        slug,
        pageLabel: label,
        metaTitle: metaTitle ?? "",
        metaDescription: metaDescription ?? "",
        metaTitleEn: metaTitleEn ?? "",
        metaDescriptionEn: metaDescriptionEn ?? "",
        metaTitleNl: metaTitleNl ?? "",
        metaDescriptionNl: metaDescriptionNl ?? "",
        metaTitleFr: metaTitleFr ?? "",
        metaDescriptionFr: metaDescriptionFr ?? "",
        keywords: keywords ?? "",
        googleVerification: googleVerification ?? "",
        headScript: headScript ?? "",
        bodyScript: bodyScript ?? "",
        updatedAt: new Date(),
      }).returning();
    }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

export default router;
