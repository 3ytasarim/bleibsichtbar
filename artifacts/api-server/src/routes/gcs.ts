import { Router, type Request, type Response } from "express";
import { streamGCSObject } from "../lib/gcsUpload.js";

const router = Router();

router.get("/*path", async (req: Request, res: Response) => {
  const key = (req.params as { path: string }).path;
  if (!key) { res.status(400).send("Missing key"); return; }
  await streamGCSObject(key, res);
});

export default router;
