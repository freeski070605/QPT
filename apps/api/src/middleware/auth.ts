import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { loadEnv } from "../config/env";

const env = loadEnv();

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ error: "Missing token" });
    return;
  }
  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    (req as Request & { user?: unknown }).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
