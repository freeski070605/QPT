import { Schema, model } from "mongoose";

const commissionSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    sizeRequest: { type: String, required: true },
    colorPalette: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: String, required: true },
    timeline: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["new", "in_review", "responded", "closed"],
      default: "new",
      index: true
    }
  },
  { timestamps: true }
);

export const Commission = model("Commission", commissionSchema);
