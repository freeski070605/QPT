import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User";
import { loadEnv } from "../config/env";

export const authRouter = Router();
const env = loadEnv();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: "collector" });
  const token = jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: "7d" });
  res.status(201).json({ user: sanitizeUser(user.toObject()), token });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: "7d" });
  res.json({ user: sanitizeUser(user.toObject()), token });
});

authRouter.get("/me", (req, res) => {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ error: "Missing token" });
    return;
  }
  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

function sanitizeUser(user: Record<string, unknown>) {
  const sanitized = { ...user };
  delete sanitized.passwordHash;
  return sanitized;
}
