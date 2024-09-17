import {S3Client} from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_BUCKET_API!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_BUCKET_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_BUCKET_SECRET_KEY!,
  },
});
