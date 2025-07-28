/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema, Document } from "mongoose";

// Check if the model is already defined
const UserModel =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new Schema({
      email: { type: String, required: true },
      password: { type: String, required: true },
      role: {
        type: String,
        enum: ["admin", "rider", "driver"],
        required: true,
      },
    })
  );

export default UserModel;
