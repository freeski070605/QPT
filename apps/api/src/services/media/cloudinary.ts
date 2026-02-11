import crypto from "crypto";
import { loadEnv } from "../../config/env";

type UploadResult = {
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
};

export async function uploadImageDataUrl(dataUrl: string): Promise<UploadResult> {
  const env = loadEnv();
  const folder = env.cloudinaryUploadFolder;

  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new Error("Cloudinary is not configured.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signaturePayload = `folder=${folder}&timestamp=${timestamp}${env.cloudinaryApiSecret}`;
  const signature = crypto.createHash("sha1").update(signaturePayload).digest("hex");

  const body = new URLSearchParams({
    file: dataUrl,
    folder,
    timestamp: String(timestamp),
    api_key: env.cloudinaryApiKey,
    signature
  });

  const response = await fetch(`https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`, {
    method: "POST",
    body
  });

  const payload = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    width?: number;
    height?: number;
    format?: string;
    error?: { message?: string };
  };

  if (!response.ok || !payload.secure_url || !payload.public_id) {
    throw new Error(payload.error?.message ?? "Image upload failed");
  }

  return {
    secureUrl: payload.secure_url,
    publicId: payload.public_id,
    width: payload.width,
    height: payload.height,
    format: payload.format
  };
}
