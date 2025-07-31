import mongoose, { Schema } from "mongoose";
import { Ride } from "./ride.interface";

const rideSchema = new Schema<Ride>({
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  status: {
    type: String,
    enum: ["requested", "accepted", "in_transit", "completed", "canceled"],
    default: "requested",
  },
  rideCost: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true, versionKey: false });

rideSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const RideModel = mongoose.model<Ride>("Ride", rideSchema);

export default RideModel;  // Ensure this export is there
