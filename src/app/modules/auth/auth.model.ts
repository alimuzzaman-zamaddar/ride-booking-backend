import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
  email: string;
  password: string;
  role: "admin" | "rider" | "driver";

  // ✅ NEW
  name?: string;
  phone?: string;

  isActive: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  isOnline: boolean;
  cost: number;
  earning: number;
  rides: string[];
  createdAt: Date;
  updatedAt: Date;
  isApproved?: boolean;
  isSuspended?: boolean;
  vehicleInfo?: string;
  licenseNumber?: string;
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "rider", "driver"], required: true },

    // ✅ NEW (optional fields)
    name: { type: String, default: "" },
    phone: { type: String, default: "" },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    cost: { type: Number, default: 0 },
    earning: { type: Number, default: 0 },
    rides: { type: [String], default: [] },
    isApproved: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    vehicleInfo: { type: String, default: "" },
    licenseNumber: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Password hashing before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
