import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface User extends Document {
  email: string;
  password: string;
  role: "admin" | "rider" | "driver";
}

const userSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "rider", "driver"], required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const UserModel = mongoose.model<User>("User", userSchema);
export default UserModel;
