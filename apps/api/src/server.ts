import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { healthRouter } from "./routes/health";
import { artworksRouter } from "./routes/artworks";
import { ordersRouter } from "./routes/orders";
import { authRouter } from "./routes/auth";
import { commissionsRouter } from "./routes/commissions";
import { adminRouter } from "./routes/admin";
import { loadEnv } from "./config/env";
import { bootstrapAdmin } from "./services/admin/bootstrapAdmin";

export function createServer() {
  const env = loadEnv();
  const app = express();

  app.disable("x-powered-by");

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || env.webOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("CORS origin blocked"));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "10mb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/artworks", artworksRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/commissions", commissionsRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);

  app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
  });

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof ZodError) {
      res.status(400).json({ error: "Validation error", details: error.flatten() });
      return;
    }

    if (error instanceof Error && error.message === "CORS origin blocked") {
      res.status(403).json({ error: error.message });
      return;
    }

    if (isMongoDuplicateKeyError(error)) {
      res.status(409).json({ error: "Duplicate value for a unique field" });
      return;
    }

    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  });

  const start = async () => {
    await mongoose.connect(env.mongoUri);
    await bootstrapAdmin({
      email: env.adminEmail,
      password: env.adminPassword,
      name: env.adminName
    });
    app.listen(env.port, () => {
      console.log(`API running on port ${env.port} (${env.nodeEnv})`);
    });
  };

  return { app, start };
}

function isMongoDuplicateKeyError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeMongoError = error as { code?: number };
  return maybeMongoError.code === 11000;
}
