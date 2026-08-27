import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const S3_ENDPOINT = process.env.S3_ENDPOINT!;
const S3_REGION = process.env.S3_REGION || "fsn1";

const s3 = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

function validateConfig(): void {
  const required = [
    "S3_BUCKET_NAME",
    "S3_ENDPOINT",
    "S3_ACCESS_KEY",
    "S3_SECRET_KEY",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`${key} environment variable is required`);
    }
  }
}

export async function uploadBufferToGCS(
  buffer: Buffer,
  originalName: string,
  mimetype: string,
  folder: string = "uploads"
): Promise<string> {
  validateConfig();

  const ext = path.extname(originalName) || ".bin";
  const key = `${folder}/${randomUUID()}${ext.toLowerCase()}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return `/api/gcs/${key}`;
}

export async function deleteGCSObject(gcsUrl: string): Promise<void> {
  if (!gcsUrl.startsWith("/api/gcs/")) return;

  validateConfig();

  const key = decodeURIComponent(
    gcsUrl.replace("/api/gcs/", "")
  );

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
  } catch (error) {
    console.error("S3 delete error:", error);
  }
}

export async function streamGCSObject(
  key: string,
  res: import("express").Response
): Promise<void> {
  validateConfig();

  try {
    const result = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: decodeURIComponent(key),
      })
    );

    res.setHeader(
      "Content-Type",
      result.ContentType || "application/octet-stream"
    );

    res.setHeader(
      "Cache-Control",
      result.CacheControl ||
        "public, max-age=31536000, immutable"
    );

    if (result.ContentLength !== undefined) {
      res.setHeader(
        "Content-Length",
        String(result.ContentLength)
      );
    }

    const body = result.Body as any;

    if (!body || typeof body.pipe !== "function") {
      res.status(500).send("Invalid object stream");
      return;
    }

    body.pipe(res);
  } catch (error: any) {
    if (
      error?.name === "NoSuchKey" ||
      error?.name === "NotFound" ||
      error?.$metadata?.httpStatusCode === 404
    ) {
      res.status(404).send("Not found");
      return;
    }

    console.error("S3 read error:", error);
    res.status(500).send("Object storage error");
  }
}
