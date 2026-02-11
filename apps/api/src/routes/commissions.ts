import { Router } from "express";
import { z } from "zod";
import { Commission } from "../models/Commission";
import { authGuard } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";

export const commissionsRouter = Router();

const commissionCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  sizeRequest: z.string().min(2),
  colorPalette: z.string().min(2),
  description: z.string().min(10),
  budget: z.string().min(1),
  timeline: z.string().min(1),
  notes: z.string().optional()
});

const commissionStatusSchema = z.object({
  status: z.enum(["new", "in_review", "responded", "closed"]).optional(),
  notes: z.string().optional()
});

commissionsRouter.post("/", async (req, res) => {
  const parsed = commissionCreateSchema.parse(req.body);
  const created = await Commission.create(parsed);
  res.status(201).json(created);
});

commissionsRouter.get("/", authGuard, requireRole(["admin"]), async (_req, res) => {
  const items = await Commission.find().sort({ createdAt: -1 }).limit(200);
  res.json(items);
});

commissionsRouter.patch("/:id/status", authGuard, requireRole(["admin"]), async (req, res) => {
  const parsed = commissionStatusSchema.parse(req.body);
  if (!parsed.status && !parsed.notes) {
    res.status(400).json({ error: "At least one field is required" });
    return;
  }

  const updated = await Commission.findByIdAndUpdate(req.params.id, parsed, { new: true, runValidators: true });

  if (!updated) {
    res.status(404).json({ error: "Commission not found" });
    return;
  }

  res.json(updated);
});

commissionsRouter.delete("/:id", authGuard, requireRole(["admin"]), async (req, res) => {
  const deleted = await Commission.findByIdAndDelete(req.params.id);

  if (!deleted) {
    res.status(404).json({ error: "Commission not found" });
    return;
  }

  res.status(204).send();
});
