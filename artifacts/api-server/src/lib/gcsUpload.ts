import { objectStorageClient } from "./objectStorage.js";
import { randomUUID } from "crypto";
import path from "path";

const BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID!;

export async function uploadBufferToGCS(
  buffer: Buffer,
  originalName: string,
  mimetype: string,
  folder: string = "uploads"
): Promise<string> {
  const ext = path.extname(originalName) || ".bin";
  const key = `${folder}/${randomUUID()}${ext}`;
  const bucket = objectStorageClient.bucket(BUCKET_ID);
  const file = bucket.file(key);
  await file.save(buffer, { contentType: mimetype, resumable: false });
  return `/api/gcs/${key}`;
}

export async function deleteGCSObject(gcsUrl: string): Promise<void> {
  if (!gcsUrl.startsWith("/api/gcs/")) return;
  const key = gcsUrl.replace("/api/gcs/", "");
  try {
    const bucket = objectStorageClient.bucket(BUCKET_ID);
    await bucket.file(key).delete();
  } catch {}
}

export async function streamGCSObject(
  key: string,
  res: import("express").Response
): Promise<void> {
  const bucket = objectStorageClient.bucket(BUCKET_ID);
  const file = bucket.file(key);
  const [exists] = await file.exists();
  if (!exists) {
    res.status(404).send("Not found");
    return;
  }
  const [metadata] = await file.getMetadata();
  res.setHeader("Content-Type", (metadata.contentType as string) || "application/octet-stream");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  file.createReadStream().pipe(res);
}
