import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Interface defining the User model
export interface User extends Document {
  email: string;
  password: string;
  role: "admin" | "rider" | "driver";
  isActive: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  cost: number;
  earning: number;
  rides: string[]; 
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition for User
const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "rider", "driver"], required: true },
    isActive: { type: Boolean, default: true }, // User active or not
    isDeleted: { type: Boolean, default: false }, // If the user is deleted or not
    isBlocked: { type: Boolean, default: false }, // If the user is blocked or not
    cost: { type: Number, default: 0 }, // Cost associated with the user
    earning: { type: Number, default: 0 }, // Earnings of the user (for drivers)
    rides: { type: [String], default: [] }, // List of ride IDs (for rider)
  },
  {
    timestamps: true, // Mongoose automatically adds `createdAt` and `updatedAt`
  }
);

// Password hashing before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Proceed if password is modified
  this.password = await bcrypt.hash(this.password, 10); // Hash the password
  next(); // Proceed with saving the document
});

// Model definition
const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
