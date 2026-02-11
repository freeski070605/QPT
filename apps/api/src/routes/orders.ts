import { Router } from "express";
import { z } from "zod";
import { Order } from "../models/Order";
import { authGuard } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";

export const ordersRouter = Router();

const paymentStatusSchema = z.enum(["awaiting_payment", "needs_review", "paid", "failed", "refunded"]);
const shippingStatusSchema = z.enum(["created", "processing", "shipped", "delivered", "cancelled"]);

const createOrderSchema = z.object({
  userId: z.string().optional(),
  artworkId: z.string(),
  paymentMethod: z.string().min(2),
  paymentProof: z.string().url().optional(),
  paymentStatus: paymentStatusSchema.optional(),
  shippingStatus: shippingStatusSchema.optional()
});

const createCashAppSchema = z.object({
  userId: z.string().optional(),
  artworkId: z.string(),
  paymentProof: z.string().url()
});

const updateStatusSchema = z.object({
  paymentStatus: paymentStatusSchema.optional(),
  shippingStatus: shippingStatusSchema.optional(),
  trackingNumber: z.string().min(2).optional()
});

ordersRouter.get("/", authGuard, requireRole(["admin"]), async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
  res.json(orders);
});

ordersRouter.post("/", async (req, res) => {
  const parsed = createOrderSchema.parse(req.body);
  const created = await Order.create(parsed);
  res.status(201).json(created);
});

ordersRouter.post("/cashapp", async (req, res) => {
  const parsed = createCashAppSchema.parse(req.body);

  const created = await Order.create({
    ...parsed,
    paymentMethod: "cashapp",
    paymentStatus: "awaiting_payment",
    shippingStatus: "created"
  });

  res.status(201).json(created);
});

ordersRouter.patch("/:id/status", authGuard, requireRole(["admin"]), async (req, res) => {
  const parsed = updateStatusSchema.parse(req.body);
  const updated = await Order.findByIdAndUpdate(req.params.id, parsed, { new: true, runValidators: true });

  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(updated);
});

ordersRouter.delete("/:id", authGuard, requireRole(["admin"]), async (req, res) => {
  const deleted = await Order.findByIdAndDelete(req.params.id);

  if (!deleted) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.status(204).send();
});
