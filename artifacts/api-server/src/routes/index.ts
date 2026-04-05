import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import projectsRouter from "./projects.js";
import blogRouter from "./blog.js";
import referencesRouter from "./references.js";
import contactRouter from "./contact.js";
import onboardingRouter from "./onboarding.js";
import clientsRouter from "./clients.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/projects", projectsRouter);
router.use("/blog", blogRouter);
router.use("/references", referencesRouter);
router.use("/contact", contactRouter);
router.use("/onboarding", onboardingRouter);
router.use("/clients", clientsRouter);

export default router;
