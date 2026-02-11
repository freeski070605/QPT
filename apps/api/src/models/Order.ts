import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    artworkId: { type: Schema.Types.ObjectId, ref: "Artwork" },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "awaiting_payment" },
    shippingStatus: { type: String, default: "created" },
    paymentProof: { type: String },
    trackingNumber: { type: String }
  },
  { timestamps: true }
);

export const Order = model("Order", orderSchema);
