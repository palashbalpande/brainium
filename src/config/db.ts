import mongoose from "mongoose";

const dbURL = process.env.MONGODB_URI as string;

export const connectDB = async () => {
  if (!dbURL) throw new Error("❌ MONGODB_URI is not defined");
  await mongoose.connect(dbURL);
};
