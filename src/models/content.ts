import mongoose, { model, Schema } from "mongoose";

const contentSchema = new Schema({
  title: String,
  link: String,
  tags: {
    type: mongoose.Types.ObjectId,
    ref: "tag",
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

export const contentModel = model("content", contentSchema);
