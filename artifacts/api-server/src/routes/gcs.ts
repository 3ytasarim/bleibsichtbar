import { Router, type Request, type Response } from "express";
import { streamGCSObject } from "../lib/gcsUpload.js";

const router = Router();

router.use("/", async (req: Request, res: Response) => {
  if (req.method !== "GET") { res.status(405).send("Method Not Allowed"); return; }
  const key = req.path.replace(/^\//, "");
  if (!key) { res.status(400).send("Missing key"); return; }
  await streamGCSObject(key, res);
});

export default router;
