import { Router } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { Artwork } from "../models/Artwork";
import { authGuard } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { uploadImageDataUrl } from "../services/media/cloudinary";

export const artworksRouter = Router();

const artworkBodySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  videoUrl: z.string().url().optional(),
  price: z.number().positive(),
  status: z.enum(["Available", "Reserved", "Sold"]).default("Available"),
  size: z.enum(["Small", "Medium", "Large"]).default("Medium"),
  tone: z.enum(["Cool", "Warm", "Balanced"]).default("Balanced"),
  editionCount: z.number().int().positive().default(1),
  dimensions: z.string().optional(),
  materials: z.string().optional(),
  paymentUrl: z.string().url().optional(),
  showInCollection: z.boolean().default(true),
  slug: z.string().optional()
});

const artworkUpdateSchema = artworkBodySchema.partial();

const listQuerySchema = z.object({
  size: z.enum(["Small", "Medium", "Large"]).optional(),
  tone: z.enum(["Cool", "Warm", "Balanced"]).optional(),
  availability: z.enum(["Available", "Reserved", "Sold"]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  includeHidden: z.coerce.boolean().optional(),
  showInCollection: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().positive().max(100).optional()
});

const artworkImageUploadSchema = z.object({
  dataUrl: z.string().startsWith("data:image/")
});

artworksRouter.get("/", async (req, res) => {
  const query = listQuerySchema.parse(req.query);
  const filter: Record<string, unknown> = {};

  if (query.size) filter.size = query.size;
  if (query.tone) filter.tone = query.tone;
  if (query.availability) filter.status = query.availability;
  if (typeof query.showInCollection === "boolean") {
    filter.showInCollection = query.showInCollection;
  } else if (!query.includeHidden) {
    filter.showInCollection = true;
  }
  if (typeof query.minPrice === "number" || typeof query.maxPrice === "number") {
    filter.price = {};
    if (typeof query.minPrice === "number") (filter.price as Record<string, number>).$gte = query.minPrice;
    if (typeof query.maxPrice === "number") (filter.price as Record<string, number>).$lte = query.maxPrice;
  }

  const items = await Artwork.find(filter)
    .sort({ createdAt: -1 })
    .limit(query.limit ?? 50);

  res.json(items);
});

artworksRouter.post("/upload-image", authGuard, requireRole(["admin"]), async (req, res) => {
  const parsed = artworkImageUploadSchema.parse(req.body);
  const upload = await uploadImageDataUrl(parsed.dataUrl);
  res.status(201).json(upload);
});

artworksRouter.post("/", authGuard, requireRole(["admin"]), async (req, res) => {
  const parsed = artworkBodySchema.parse(req.body);
  const slug = parsed.slug ?? slugify(parsed.title);

  const created = await Artwork.create({
    ...parsed,
    slug
  });

  res.status(201).json(created);
});

artworksRouter.patch("/:id", authGuard, requireRole(["admin"]), async (req, res) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: "Invalid artwork id" });
    return;
  }

  const parsed = artworkUpdateSchema.parse(req.body);

  const updatePayload = {
    ...parsed,
    ...(parsed.title ? { slug: parsed.slug ?? slugify(parsed.title) } : {})
  };

  const updated = await Artwork.findByIdAndUpdate(req.params.id, updatePayload, {
    new: true,
    runValidators: true
  });

  if (!updated) {
    res.status(404).json({ error: "Artwork not found" });
    return;
  }

  res.json(updated);
});

artworksRouter.delete("/:id", authGuard, requireRole(["admin"]), async (req, res) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: "Invalid artwork id" });
    return;
  }

  const deleted = await Artwork.findByIdAndDelete(req.params.id);

  if (!deleted) {
    res.status(404).json({ error: "Artwork not found" });
    return;
  }

  res.status(204).send();
});

artworksRouter.get("/:slugOrId", async (req, res) => {
  const { slugOrId } = req.params;

  const query = Types.ObjectId.isValid(slugOrId) ? { $or: [{ _id: slugOrId }, { slug: slugOrId }] } : { slug: slugOrId };
  const item = await Artwork.findOne(query);

  if (!item) {
    res.status(404).json({ error: "Artwork not found" });
    return;
  }

  res.json(item);
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
