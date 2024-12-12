"use server";

import {FILE_SIZE_LIMIT, R2_PUBLIC_URL} from "@/constants";
import {s3Client} from "@/lib/r2";
import {getErrorMessage} from "@/lib/utils";
import {ResponseType} from "@/types";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {nanoid} from "nanoid";

if (!process.env.CLOUDFLARE_BUCKET_NAME) {
  throw new Error("CLOUDFLARE_BUCKET_NAME is not defined");
}

if (!R2_PUBLIC_URL) {
  throw new Error("R2_PUBLIC_URL is not defined");
}

const generateFileName = (file: File) => {
  const uuid = nanoid();
  const fileExtension = file.name.split(".").pop();
  return `${uuid}.${fileExtension}`;
};

export const uploadFile = async (
  formData: FormData,
): Promise<ResponseType<{url: string}>> => {
  const file = formData.get("file") as File | null;

  if (!file) {
    return {success: false, message: "No file uploaded.", data: {url: ""}};
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    if (!buffer) {
      return {success: false, message: "No file uploaded", data: {url: ""}};
    }

    if (buffer.byteLength > FILE_SIZE_LIMIT) {
      return {
        success: false,
        message: `File size exceeds the limit of ${(
          FILE_SIZE_LIMIT / 1_000_000
        ).toFixed(0)} MB`,
        data: {url: ""},
      };
    }

    const fileName = generateFileName(file);
    const fileType = file.type || "application/octet-stream";

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: fileType,
    });

    await s3Client.send(command);

    const url = `${R2_PUBLIC_URL}/${fileName}`;

    return {
      success: true,
      message: "File uploaded successfully",
      data: {url},
    };
  } catch (error: unknown) {
    console.error(error);
    return {success: false, message: getErrorMessage(error), data: {url: ""}};
  }
};
