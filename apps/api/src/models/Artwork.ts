import { Schema, model } from "mongoose";

const artworkSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    images: [{ type: String }],
    videoUrl: { type: String },
    price: { type: Number, required: true },
    status: { type: String, enum: ["Available", "Reserved", "Sold"], default: "Available" },
    size: { type: String, enum: ["Small", "Medium", "Large"], default: "Medium" },
    tone: { type: String, enum: ["Cool", "Warm", "Balanced"], default: "Balanced" },
    editionCount: { type: Number, default: 1 },
    dimensions: { type: String },
    materials: { type: String },
    paymentUrl: { type: String },
    showInCollection: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

export const Artwork = model("Artwork", artworkSchema);
