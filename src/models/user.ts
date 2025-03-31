import mongoose, { Model, Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
})

export const userModel = mongoose.model("user", userSchema);