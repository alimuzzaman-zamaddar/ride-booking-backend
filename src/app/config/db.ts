import mongoose from "mongoose";
import { envVars } from "./env";

const connectDB = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
