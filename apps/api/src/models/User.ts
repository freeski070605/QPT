import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "collector" },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Artwork" }],
    orderHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }]
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
