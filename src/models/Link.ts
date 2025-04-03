import mongoose, { model, Schema } from "mongoose";

const linkSchema = new Schema({
  hash: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },
});

export const linkModel = model("link", linkSchema);
