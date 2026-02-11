import { Router } from "express";
import { z } from "zod";
import { authGuard } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { Artwork } from "../models/Artwork";
import { Commission } from "../models/Commission";
import { Order } from "../models/Order";
import { User } from "../models/User";

export const adminRouter = Router();

adminRouter.use(authGuard, requireRole(["admin"]));

adminRouter.get("/overview", async (_req, res) => {
  const [artworksCount, availableArtworks, soldArtworks, ordersCount, pendingPayments, commissionsOpen] = await Promise.all([
    Artwork.countDocuments(),
    Artwork.countDocuments({ status: "Available" }),
    Artwork.countDocuments({ status: "Sold" }),
    Order.countDocuments(),
    Order.countDocuments({ paymentStatus: { $in: ["awaiting_payment", "needs_review"] } }),
    Commission.countDocuments({ status: { $in: ["new", "in_review"] } })
  ]);

  res.json({
    artworks: {
      total: artworksCount,
      available: availableArtworks,
      sold: soldArtworks
    },
    orders: {
      total: ordersCount,
      pendingPaymentReview: pendingPayments
    },
    commissions: {
      open: commissionsOpen
    }
  });
});

adminRouter.get("/users", async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(250).select("-passwordHash");
  res.json(users);
});

const userRoleSchema = z.object({
  role: z.enum(["admin", "collector"])
});

adminRouter.patch("/users/:id/role", async (req, res) => {
  const parsed = userRoleSchema.parse(req.body);
  const updated = await User.findByIdAndUpdate(req.params.id, { role: parsed.role }, { new: true, runValidators: true }).select(
    "-passwordHash"
  );

  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(updated);
});
