import { Router, type IRouter, type Request, type Response } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import projectsRouter from "./projects.js";
import blogRouter from "./blog.js";
import referencesRouter from "./references.js";
import contactRouter from "./contact.js";
import onboardingRouter from "./onboarding.js";
import clientsRouter from "./clients.js";
import partnersRouter from "./partners.js";
import gcsRouter from "./gcs.js";
import seoRouter from "./seo.js";
import analyseRouter from "./analyse.js";
import customersRouter from "./customers.js";
import customerAuthRouter from "./customerAuth.js";
import portalRouter from "./portal.js";
import supportTicketsRouter from "./supportTickets.js";
import { db, projectsTable, blogPostsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/projects", projectsRouter);
router.use("/blog", blogRouter);
router.use("/references", referencesRouter);
router.use("/contact", contactRouter);
router.use("/onboarding", onboardingRouter);
router.use("/clients", clientsRouter);
router.use("/partners", partnersRouter);
router.use("/gcs", gcsRouter);
router.use("/seo", seoRouter);
router.use("/analyse", analyseRouter);
router.use("/customers", customersRouter);
router.use("/customer-auth", customerAuthRouter);
router.use("/portal", portalRouter);
router.use("/support-tickets", supportTicketsRouter);

router.get("/sitemap.xml", async (_req: Request, res: Response) => {
  try {
    const baseUrl = "https://bleibsichtbar.com";
    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/social-media", priority: "0.9", changefreq: "monthly" },
      { loc: "/webseiten", priority: "0.9", changefreq: "monthly" },
      { loc: "/marketing-ads", priority: "0.9", changefreq: "monthly" },
      { loc: "/ki-automatisierungen", priority: "0.9", changefreq: "monthly" },
      { loc: "/analyse", priority: "0.8", changefreq: "monthly" },
      { loc: "/projekte", priority: "0.8", changefreq: "weekly" },
      { loc: "/blog", priority: "0.8", changefreq: "weekly" },
      { loc: "/referenzen", priority: "0.7", changefreq: "monthly" },
      { loc: "/kontakt", priority: "0.7", changefreq: "yearly" },
    ];

    const projects = await db.select({ id: projectsTable.id, updatedAt: projectsTable.updatedAt })
      .from(projectsTable).where(eq(projectsTable.published, true));

    const posts = await db.select({ id: blogPostsTable.id, updatedAt: blogPostsTable.updatedAt })
      .from(blogPostsTable).where(eq(blogPostsTable.published, true));

    const now = new Date().toISOString().split("T")[0];

    const urls = [
      ...staticPages.map(p => `  <url>\n    <loc>${baseUrl}${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n    <lastmod>${now}</lastmod>\n  </url>`),
      ...projects.map(p => `  <url>\n    <loc>${baseUrl}/projekte/${p.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n    <lastmod>${p.updatedAt ? new Date(p.updatedAt).toISOString().split("T")[0] : now}</lastmod>\n  </url>`),
      ...posts.map(p => `  <url>\n    <loc>${baseUrl}/blog/${p.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n    <lastmod>${p.updatedAt ? new Date(p.updatedAt).toISOString().split("T")[0] : now}</lastmod>\n  </url>`),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch {
    res.status(500).send("Error generating sitemap");
  }
});

router.get("/robots.txt", (_req: Request, res: Response) => {
  const txt = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /api/",
    "",
    "Sitemap: https://bleibsichtbar.com/sitemap.xml",
    "",
    "# bleibsichtbar.com",
  ].join("\n");
  res.set("Content-Type", "text/plain");
  res.send(txt);
});

export default router;
