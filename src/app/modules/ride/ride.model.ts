import mongoose, { Schema, Document } from "mongoose";

interface Ride extends Document {
  riderId: string;
  driverId?: string; // Driver is assigned once the ride is accepted
  pickupLocation: string;
  destination: string;
  status: "requested" | "accepted" | "in_transit" | "completed" | "canceled";
  earnings?: number; // New field for earnings
  createdAt: Date;
  updatedAt: Date;
}

const rideSchema = new Schema<Ride>({
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Driver is optional until the ride is accepted
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  status: {
    type: String,
    enum: ["requested", "accepted", "in_transit", "completed", "canceled"],
    default: "requested",
  },
  earnings: { type: Number, default: 0 }, // Field to store earnings
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the 'updatedAt' field on each modification
rideSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const RideModel = mongoose.model<Ride>("Ride", rideSchema);
export default RideModel;
