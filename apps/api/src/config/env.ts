import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z.object({
  PORT: z.string().default("4000"),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string().min(12, "JWT_SECRET must be at least 12 characters"),
  WEB_ORIGIN: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(10).optional(),
  ADMIN_NAME: z.string().min(2).optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
});

type Env = {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  webOrigins: string[];
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  adminEmail?: string;
  adminPassword?: string;
  adminName?: string;
  nodeEnv: "development" | "test" | "production";
};

let cachedEnv: Env | undefined;

export function loadEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.parse({
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    WEB_ORIGIN: process.env.WEB_ORIGIN,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_NAME: process.env.ADMIN_NAME,
    NODE_ENV: process.env.NODE_ENV
  });

  cachedEnv = {
    port: Number(parsed.PORT),
    mongoUri: parsed.MONGODB_URI,
    jwtSecret: parsed.JWT_SECRET,
    webOrigins: (parsed.WEB_ORIGIN ?? "http://localhost:3000")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    cloudinaryCloudName: parsed.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: parsed.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: parsed.CLOUDINARY_API_SECRET,
    adminEmail: parsed.ADMIN_EMAIL,
    adminPassword: parsed.ADMIN_PASSWORD,
    adminName: parsed.ADMIN_NAME,
    nodeEnv: parsed.NODE_ENV
  };

  return cachedEnv;
}
